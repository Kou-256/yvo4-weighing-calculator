"use client";

import React from "react";

const COMPOUNDS = {
  yvo4: {
    key: "yvo4",
    formula: "YVO₄",
    hostElement: "Y",
    hostOxide: "Y₂O₃",
    filePrefix: "yvo4",
  },
  gdvo4: {
    key: "gdvo4",
    formula: "GdVO₄",
    hostElement: "Gd",
    hostOxide: "Gd₂O₃",
    filePrefix: "gdvo4",
  },
};

const RARE_EARTH_DOPANTS = {
  Tm: "Tm₂O₃",
  Eu: "Eu₂O₃",
  Er: "Er₂O₃",
  Yb: "Yb₂O₃",
  Ho: "Ho₂O₃",
  Dy: "Dy₂O₃",
  Tb: "Tb₂O₃",
  Gd: "Gd₂O₃",
  Sm: "Sm₂O₃",
  Nd: "Nd₂O₃",
  Pr: "Pr₂O₃",
  Ce: "Ce₂O₃",
  La: "La₂O₃",
};

const OTHER_SUBSTITUENTS = { Bi: "Bi₂O₃" };
const ALL_ADDITIVES = { ...RARE_EARTH_DOPANTS, ...OTHER_SUBSTITUENTS };

const MATERIALS = {
  "V₂O₅": 181.8804,
  "Y₂O₃": 225.8982,
  "Bi₂O₃": 465.959,
  "Tm₂O₃": 385.8672,
  "Eu₂O₃": 351.926,
  "Er₂O₃": 382.5176,
  "Yb₂O₃": 394.0782,
  "Ho₂O₃": 377.8586,
  "Dy₂O₃": 372.9982,
  "Tb₂O₃": 365.8678,
  "Gd₂O₃": 362.4982,
  "Sm₂O₃": 348.7182,
  "Nd₂O₃": 336.4782,
  "Pr₂O₃": 329.8082,
  "Ce₂O₃": 328.2382,
  "La₂O₃": 325.8092,
};

const BASE_METAL_MOL = 0.004;
const DEFAULT_SET_COUNT = 4;
const DEFAULT_DECIMAL_PLACES = 4;

const STORAGE_KEYS = {
  selectedCompound: "weighing_selectedCompound",
  selectedDopants: "weighing_selectedDopants",
  targetMol: "weighing_targetMol",
  concentrationSets: "weighing_concentrationSets",
  measuredValues: "weighing_measuredValues",
  weightedMaterials: "weighing_weightedMaterials",
  setCount: "weighing_setCount",
  decimalPlaces: "weighing_decimalPlaces",
};

const makeSetNumbers = (count) =>
  Array.from({ length: count }, (_, index) => index + 1);

const makeEmptySets = (count) =>
  Object.fromEntries(makeSetNumbers(count).map((setNumber) => [setNumber, {}]));

const clampInteger = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

const normalizeSets = (sets, count) => {
  const source = sets && typeof sets === "object" ? sets : {};
  return Object.fromEntries(
    makeSetNumbers(count).map((setNumber) => [setNumber, { ...(source[setNumber] || {}) }])
  );
};

function StepperField({ label, value, min, max, onChange, help }) {
  const update = (nextValue) => onChange(clampInteger(nextValue, min, max, value));

  return (
    <label className="setting-field">
      <span className="setting-label">{label}</span>
      <span className="stepper-shell">
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => update(event.target.value)}
        />
        <span className="stepper-buttons">
          <button type="button" aria-label={`${label}を増やす`} onClick={() => update(value + 1)}>⌃</button>
          <button type="button" aria-label={`${label}を減らす`} onClick={() => update(value - 1)}>⌄</button>
        </span>
      </span>
      <span className="setting-help">{help}</span>
    </label>
  );
}

function ElementButton({ element, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`element-button ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      onPointerUp={(event) => event.currentTarget.blur()}
    >
      {element}
    </button>
  );
}

function MainComponent() {
  const [selectedCompound, setSelectedCompound] = React.useState("yvo4");
  const [selectedDopants, setSelectedDopants] = React.useState([]);
  const [targetMol, setTargetMol] = React.useState("0.004");
  const [setCount, setSetCount] = React.useState(DEFAULT_SET_COUNT);
  const [decimalPlaces, setDecimalPlaces] = React.useState(DEFAULT_DECIMAL_PLACES);
  const [concentrationSets, setConcentrationSets] = React.useState(() => makeEmptySets(DEFAULT_SET_COUNT));
  const [measuredValues, setMeasuredValues] = React.useState(() => makeEmptySets(DEFAULT_SET_COUNT));
  const [weightedMaterials, setWeightedMaterials] = React.useState(() => makeEmptySets(DEFAULT_SET_COUNT));
  const [results, setResults] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showMaterials, setShowMaterials] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  const compound = COMPOUNDS[selectedCompound];
  const setNumbers = React.useMemo(() => makeSetNumbers(setCount), [setCount]);
  const availableRareEarths = React.useMemo(
    () => Object.keys(RARE_EARTH_DOPANTS).filter((element) => element !== compound.hostElement),
    [compound.hostElement]
  );
  const selectedRareEarths = selectedDopants.filter((element) => element in RARE_EARTH_DOPANTS);
  const selectedOtherSubstituents = selectedDopants.filter((element) => element in OTHER_SUBSTITUENTS);
  const concentrationStep = 10 ** -decimalPlaces;

  React.useEffect(() => {
    try {
      const savedCount = clampInteger(localStorage.getItem(STORAGE_KEYS.setCount), 1, 20, DEFAULT_SET_COUNT);
      const savedPrecision = clampInteger(localStorage.getItem(STORAGE_KEYS.decimalPlaces), 0, 8, DEFAULT_DECIMAL_PLACES);
      const savedCompound = localStorage.getItem(STORAGE_KEYS.selectedCompound);
      const initialCompound = COMPOUNDS[savedCompound] ? savedCompound : "yvo4";
      const parsedDopants = JSON.parse(localStorage.getItem(STORAGE_KEYS.selectedDopants) || "[]")
        .filter((element) => element in ALL_ADDITIVES && element !== COMPOUNDS[initialCompound].hostElement);

      setSetCount(savedCount);
      setDecimalPlaces(savedPrecision);
      setSelectedCompound(initialCompound);
      setSelectedDopants(parsedDopants);
      setTargetMol(localStorage.getItem(STORAGE_KEYS.targetMol) || "0.004");
      setConcentrationSets(normalizeSets(JSON.parse(localStorage.getItem(STORAGE_KEYS.concentrationSets) || "{}"), savedCount));
      setMeasuredValues(normalizeSets(JSON.parse(localStorage.getItem(STORAGE_KEYS.measuredValues) || "{}"), savedCount));
      setWeightedMaterials(normalizeSets(JSON.parse(localStorage.getItem(STORAGE_KEYS.weightedMaterials) || "{}"), savedCount));
    } catch (error) {
      console.error("保存済みデータを読み込めませんでした。", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;
    const values = {
      [STORAGE_KEYS.selectedCompound]: selectedCompound,
      [STORAGE_KEYS.selectedDopants]: JSON.stringify(selectedDopants),
      [STORAGE_KEYS.targetMol]: targetMol,
      [STORAGE_KEYS.setCount]: String(setCount),
      [STORAGE_KEYS.decimalPlaces]: String(decimalPlaces),
      [STORAGE_KEYS.concentrationSets]: JSON.stringify(concentrationSets),
      [STORAGE_KEYS.measuredValues]: JSON.stringify(measuredValues),
      [STORAGE_KEYS.weightedMaterials]: JSON.stringify(weightedMaterials),
    };
    Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, value));
  }, [isHydrated, selectedCompound, selectedDopants, targetMol, setCount, decimalPlaces, concentrationSets, measuredValues, weightedMaterials]);

  const updateSetCount = (nextCount) => {
    setSetCount(nextCount);
    setConcentrationSets((current) => normalizeSets(current, nextCount));
    setMeasuredValues((current) => normalizeSets(current, nextCount));
    setWeightedMaterials((current) => normalizeSets(current, nextCount));
    setResults(null);
  };

  const switchCompound = (compoundKey) => {
    const nextCompound = COMPOUNDS[compoundKey];
    setSelectedCompound(compoundKey);
    setSelectedDopants((current) => current.filter((element) => element !== nextCompound.hostElement));
    setConcentrationSets((current) => Object.fromEntries(
      setNumbers.map((setNumber) => {
        const nextSet = { ...(current[setNumber] || {}) };
        delete nextSet[nextCompound.hostElement];
        return [setNumber, nextSet];
      })
    ));
    setResults(null);
  };

  const toggleDopant = (element) => {
    const removing = selectedDopants.includes(element);
    setSelectedDopants((current) =>
      removing ? current.filter((item) => item !== element) : [...current, element]
    );
    setConcentrationSets((current) => Object.fromEntries(
      setNumbers.map((setNumber) => {
        const nextSet = { ...(current[setNumber] || {}) };
        if (removing) delete nextSet[element];
        else nextSet[element] = "0";
        return [setNumber, nextSet];
      })
    ));
    setResults(null);
  };

  const updateConcentration = (setNumber, element, rawValue) => {
    const normalized = rawValue.replace(",", ".");
    const pattern = decimalPlaces === 0
      ? /^\d*$/
      : new RegExp(`^\\d*(?:\\.\\d{0,${decimalPlaces}})?$`);
    if (!pattern.test(normalized)) return;
    if (normalized !== "" && Number(normalized) > 100) return;

    setConcentrationSets((current) => ({
      ...current,
      [setNumber]: { ...current[setNumber], [element]: normalized },
    }));
    setResults(null);
  };

  const normalizeConcentration = (setNumber, element) => {
    const value = concentrationSets[setNumber]?.[element];
    if (value === "" || value === ".") updateConcentration(setNumber, element, "0");
  };

  const incrementConcentration = (setNumber, element, direction) => {
    const current = Number(concentrationSets[setNumber]?.[element] || 0);
    const next = Math.min(100, Math.max(0, current + concentrationStep * direction));
    updateConcentration(setNumber, element, next.toFixed(decimalPlaces));
  };

  const substitutionTotal = (setNumber) => selectedDopants.reduce(
    (sum, element) => sum + Number(concentrationSets[setNumber]?.[element] || 0), 0
  );

  const calculateMassesForSet = (setNumber, targetMetalMol) => {
    const masses = {};
    const concentrations = {};

    selectedRareEarths.forEach((element) => {
      const concentration = Number(concentrationSets[setNumber]?.[element] || 0);
      concentrations[element] = concentration;
      masses[RARE_EARTH_DOPANTS[element]] = (targetMetalMol * concentration / 100 / 2) * MATERIALS[RARE_EARTH_DOPANTS[element]];
    });

    selectedOtherSubstituents.forEach((element) => {
      const concentration = Number(concentrationSets[setNumber]?.[element] || 0);
      concentrations[element] = concentration;
      masses[OTHER_SUBSTITUENTS[element]] = (targetMetalMol * concentration / 100 / 2) * MATERIALS[OTHER_SUBSTITUENTS[element]];
    });

    const hostConcentration = 100 - substitutionTotal(setNumber);
    concentrations[compound.hostElement] = hostConcentration;
    concentrations.V = 100;
    masses[compound.hostOxide] = (targetMetalMol * hostConcentration / 100 / 2) * MATERIALS[compound.hostOxide];
    masses["V₂O₅"] = (targetMetalMol / 2) * MATERIALS["V₂O₅"];
    return { masses, concentrations };
  };

  const calculateMasses = () => {
    const targetMetalMol = Number(targetMol);
    if (!Number.isFinite(targetMetalMol) || targetMetalMol <= 0) {
      setErrorMessage("目標モル数は0より大きい数値を入力してください。");
      return;
    }
    const invalidSet = setNumbers.find((setNumber) => substitutionTotal(setNumber) > 100);
    if (invalidSet) {
      setErrorMessage(`セット ${invalidSet} の置換濃度の合計が100%を超えています。`);
      return;
    }

    setErrorMessage("");
    setResults(Object.fromEntries(
      setNumbers.map((setNumber) => [setNumber, calculateMassesForSet(setNumber, targetMetalMol)])
    ));
  };

  const formatValue = (value) => Number(value || 0).toFixed(decimalPlaces);

  const updateMeasuredValue = (setNumber, material, value) => {
    setMeasuredValues((current) => ({
      ...current,
      [setNumber]: { ...current[setNumber], [material]: value },
    }));
  };

  const adjustMeasuredValue = (setNumber, material, direction) => {
    const current = Number(measuredValues[setNumber]?.[material] || 0);
    updateMeasuredValue(setNumber, material, Math.max(0, current + concentrationStep * direction).toFixed(decimalPlaces));
  };

  const matchCalculatedValue = (setNumber, material, calculated) => {
    updateMeasuredValue(setNumber, material, formatValue(calculated));
  };

  const toggleWeighted = (setNumber, material) => {
    setWeightedMaterials((current) => ({
      ...current,
      [setNumber]: {
        ...current[setNumber],
        [material]: !current[setNumber]?.[material],
      },
    }));
  };

  const resetAll = () => {
    setSelectedCompound("yvo4");
    setSelectedDopants([]);
    setTargetMol("0.004");
    setSetCount(DEFAULT_SET_COUNT);
    setDecimalPlaces(DEFAULT_DECIMAL_PLACES);
    setConcentrationSets(makeEmptySets(DEFAULT_SET_COUNT));
    setMeasuredValues(makeEmptySets(DEFAULT_SET_COUNT));
    setWeightedMaterials(makeEmptySets(DEFAULT_SET_COUNT));
    setResults(null);
    setErrorMessage("");
  };

  const exportToCSV = () => {
    if (!results) return;
    const rows = [["化合物", "セット", "材料", "計算値 (g)", "測定値 (g)", "秤量済み"]];
    setNumbers.forEach((setNumber) => {
      Object.entries(results[setNumber].masses).forEach(([material, calculated]) => {
        rows.push([
          compound.formula,
          setNumber,
          material,
          formatValue(calculated),
          measuredValues[setNumber]?.[material] || "",
          weightedMaterials[setNumber]?.[material] ? "はい" : "いいえ",
        ]);
      });
    });
    const blob = new Blob(["\ufeff" + rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${compound.filePrefix}_measurements_${targetMol}mol.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const reagentAmounts = React.useMemo(() => {
    const ratio = Number(targetMol || 0) / BASE_METAL_MOL;
    return {
      "硝酸": `${(5 * ratio).toFixed(2)} ml`,
      "純水": `${(40 * ratio).toFixed(2)} ml`,
      "クエン酸水和物": `${(3.3622 * ratio).toFixed(4)} g`,
      "プロピレングリコール": `${(1.17 * ratio).toFixed(2)} ml`,
    };
  }, [targetMol]);

  const activeMaterials = React.useMemo(() => {
    const names = ["V₂O₅", compound.hostOxide, ...selectedDopants.map((element) => ALL_ADDITIVES[element])];
    return [...new Set(names)];
  }, [compound.hostOxide, selectedDopants]);

  return (
    <main className="calculator-page">
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">CITRATE COMPLEX METHOD</p>
            <h1>YVO₄ / GdVO₄ 秤量計算ツール</h1>
            <p>母材を選び、添加濃度と秤量値をセットごとにまとめて管理できます。</p>
          </div>
          <div className="current-compound-card">
            <span>現在の母材</span>
            <strong>{compound.formula}</strong>
          </div>
        </header>

        <div className="workspace-grid">
          <aside className="settings-panel" aria-label="計算設定">
            <div className="setting-field">
              <span className="setting-label">化合物（母材）</span>
              <div className="compound-toggle">
                {Object.values(COMPOUNDS).map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    aria-pressed={selectedCompound === item.key}
                    className={selectedCompound === item.key ? "is-selected" : ""}
                    onClick={() => switchCompound(item.key)}
                  >
                    {item.formula}
                  </button>
                ))}
              </div>
            </div>

            <label className="setting-field">
              <span className="setting-label">目標モル数</span>
              <span className="unit-field">
                <input
                  aria-label="目標モル数"
                  type="text"
                  inputMode="decimal"
                  value={targetMol}
                  onChange={(event) => {
                    if (/^\d*(?:\.\d*)?$/.test(event.target.value)) {
                      setTargetMol(event.target.value);
                      setResults(null);
                    }
                  }}
                />
                <span>mol</span>
              </span>
            </label>

            <div className="settings-pair">
              <StepperField
                label="小数点以下の桁数"
                value={decimalPlaces}
                min={0}
                max={8}
                onChange={(value) => { setDecimalPlaces(value); setResults(null); }}
                help="0〜8桁"
              />
              <StepperField
                label="セット数"
                value={setCount}
                min={1}
                max={20}
                onChange={updateSetCount}
                help="1〜20セット"
              />
            </div>

            <div className="desktop-actions">
              <button type="button" className="primary-button" onClick={calculateMasses}>計算する</button>
              <button type="button" className="secondary-button" onClick={resetAll}>入力をリセット</button>
            </div>
          </aside>

          <div className="main-workspace">
            <section className="section-block element-section">
              <div className="section-heading">
                <div>
                  <h2>置換元素の選択</h2>
                  <p>使用する元素だけを選択してください。</p>
                </div>
                <button type="button" className="text-button" onClick={() => setShowMaterials((value) => !value)}>
                  {showMaterials ? "分子量を隠す" : "分子量を表示"}
                </button>
              </div>

              <div className="element-group">
                <h3>希土類元素（母材サイト置換）</h3>
                <div className="element-grid">
                  {availableRareEarths.map((element) => (
                    <ElementButton
                      key={element}
                      element={element}
                      selected={selectedDopants.includes(element)}
                      onClick={() => toggleDopant(element)}
                    />
                  ))}
                </div>
              </div>

              <div className="element-group other-elements">
                <h3>その他の置換元素</h3>
                <ElementButton
                  element="Bi"
                  selected={selectedDopants.includes("Bi")}
                  onClick={() => toggleDopant("Bi")}
                />
                <p className="info-note"><span aria-hidden="true">i</span>Biは希土類元素ではありませんが、母材サイトを置換します。</p>
              </div>

              {showMaterials && (
                <div className="molar-mass-list">
                  {activeMaterials.map((material) => (
                    <span key={material}><strong>{material}</strong>{MATERIALS[material]} g/mol</span>
                  ))}
                </div>
              )}
            </section>

            <section className="section-block concentration-section">
              <div className="section-heading">
                <div>
                  <h2>添加濃度（各セット）</h2>
                  <p>矢印キーまたは±ボタンで {concentrationStep.toFixed(decimalPlaces)}% ずつ調整できます。</p>
                </div>
                <span className="host-balance-label">母材酸化物 {compound.hostOxide}</span>
              </div>

              <div className="concentration-table" role="table" aria-label="添加濃度">
                <div className="concentration-header" role="row">
                  <span>セット</span><span>濃度（%）</span><span>母材比率</span>
                </div>
                {setNumbers.map((setNumber) => (
                  <div className="concentration-row" role="row" key={setNumber}>
                    <strong>{setNumber}</strong>
                    <div className="concentration-inputs">
                      {selectedDopants.length === 0 ? (
                        <span className="empty-state">添加元素なし（純粋系）</span>
                      ) : selectedDopants.map((element) => (
                        <label key={element}>
                          <span>{element}</span>
                          <span className="compact-number-field">
                            <input
                              aria-label={`セット ${setNumber} ${element} 濃度`}
                              type="text"
                              inputMode="decimal"
                              value={concentrationSets[setNumber]?.[element] ?? ""}
                              onChange={(event) => updateConcentration(setNumber, element, event.target.value)}
                              onBlur={() => normalizeConcentration(setNumber, element)}
                              onKeyDown={(event) => {
                                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                                  event.preventDefault();
                                  incrementConcentration(setNumber, element, event.key === "ArrowUp" ? 1 : -1);
                                }
                              }}
                            />
                            <button type="button" aria-label={`${element}を減らす`} onClick={() => incrementConcentration(setNumber, element, -1)}>−</button>
                            <button type="button" aria-label={`${element}を増やす`} onClick={() => incrementConcentration(setNumber, element, 1)}>＋</button>
                          </span>
                        </label>
                      ))}
                    </div>
                    <span className="host-balance">{compound.hostElement} {(100 - substitutionTotal(setNumber)).toFixed(decimalPlaces)}%</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="mobile-actions">
              <button type="button" className="primary-button" onClick={calculateMasses}>計算する</button>
              <button type="button" className="secondary-button" onClick={resetAll}>入力をリセット</button>
            </div>

            {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
          </div>
        </div>

        {results && (
          <section className="results-section">
            <div className="results-heading">
              <div>
                <h2>計算結果</h2>
                <p>{compound.formula}・目標モル数 {targetMol} mol・{setCount}セット</p>
              </div>
              <button type="button" className="secondary-button csv-button" onClick={exportToCSV}>CSV出力</button>
            </div>

            <div className="result-set-list">
              {setNumbers.map((setNumber) => (
                <article className="result-set" key={setNumber}>
                  <div className="result-set-title">
                    <h3>セット {setNumber}</h3>
                    <span>{selectedDopants.length ? selectedDopants.map((element) => `${element} ${concentrationSets[setNumber]?.[element] || 0}%`).join(" / ") : "純粋系"}</span>
                  </div>
                  <div className="result-table" role="table" aria-label={`セット ${setNumber} の秤量結果`}>
                    <div className="result-header" role="row">
                      <span>試薬</span><span>計算値</span><span>実測値</span><span>秤量済み</span><span>微調整</span>
                    </div>
                    {Object.entries(results[setNumber].masses).map(([material, calculated]) => (
                      <div className="result-row" role="row" key={material}>
                        <strong className="material-name">{material}</strong>
                        <span className="calculated-value">{formatValue(calculated)} g</span>
                        <div className="measured-field">
                          <span className="mobile-only-label">実測値</span>
                          <input
                            aria-label={`セット ${setNumber} ${material} 実測値`}
                            type="number"
                            min="0"
                            step={concentrationStep}
                            value={measuredValues[setNumber]?.[material] ?? ""}
                            placeholder={formatValue(calculated)}
                            onChange={(event) => updateMeasuredValue(setNumber, material, event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                                event.preventDefault();
                                adjustMeasuredValue(setNumber, material, event.key === "ArrowUp" ? 1 : -1);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="match-button"
                            onClick={() => matchCalculatedValue(setNumber, material, calculated)}
                          >
                            ぴったり
                          </button>
                        </div>
                        <label className="weighted-check">
                          <input
                            aria-label={`セット ${setNumber} ${material} 秤量済み`}
                            type="checkbox"
                            checked={Boolean(weightedMaterials[setNumber]?.[material])}
                            onChange={() => toggleWeighted(setNumber, material)}
                          />
                          <span>完了</span>
                        </label>
                        <div className="fine-adjustment" aria-label="実測値を微調整">
                          <button type="button" aria-label={`${material}を減らす`} onClick={() => adjustMeasuredValue(setNumber, material, -1)}>−</button>
                          <span>{concentrationStep.toFixed(decimalPlaces)}</span>
                          <button type="button" aria-label={`${material}を増やす`} onClick={() => adjustMeasuredValue(setNumber, material, 1)}>＋</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="reagent-section">
              <div>
                <h3>必要な試薬量</h3>
                <p>目標モル数に合わせた目安です。</p>
              </div>
              <dl>
                {Object.entries(reagentAmounts).map(([name, amount]) => (
                  <div key={name}><dt>{name}</dt><dd>{amount}</dd></div>
                ))}
              </dl>
              <button type="button" className="text-button" onClick={() => setShowDetails((value) => !value)}>
                {showDetails ? "計算条件を閉じる" : "計算条件を確認"}
              </button>
              {showDetails && (
                <p className="calculation-note">希土類元素とBiはいずれも母材サイトを置換するものとして、設定濃度を母材量から差し引いて計算します。</p>
              )}
            </div>
          </section>
        )}

        <footer>
          <a href="https://github.com/Kou-256/weighing-calculator" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <span>Created by Kou Hashizume</span>
        </footer>
      </div>
    </main>
  );
}

export default MainComponent;
