"use client";

import React from "react";

const SET_NUMBERS = [1, 2, 3, 4];

const COMPOUNDS = {
  yvo4: {
    key: "yvo4",
    formula: "YVO₄",
    label: "YVO4",
    hostElement: "Y",
    hostOxide: "Y₂O₃",
    filePrefix: "yvo4",
    tone: "Y site",
  },
  gdvo4: {
    key: "gdvo4",
    formula: "GdVO₄",
    label: "GdVO4",
    hostElement: "Gd",
    hostOxide: "Gd₂O₃",
    filePrefix: "gdvo4",
    tone: "Gd site",
  },
};

const DOPANTS = {
  Bi: "Bi₂O₃",
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

const createEmptySets = () =>
  SET_NUMBERS.reduce((sets, setNumber) => {
    sets[setNumber] = {};
    return sets;
  }, {});

const pruneObjectKeyFromSets = (sets, keyToRemove) =>
  SET_NUMBERS.reduce((nextSets, setNumber) => {
    const currentSet = { ...(sets?.[setNumber] || {}) };
    delete currentSet[keyToRemove];
    nextSets[setNumber] = currentSet;
    return nextSets;
  }, {});

const STORAGE_KEYS = {
  selectedCompound: "yvo4_selectedCompound",
  selectedDopants: "yvo4_selectedDopants",
  targetMol: "yvo4_targetMol",
  concentrationSets: "yvo4_concentrationSets",
  measuredValues: "yvo4_measuredValues",
  weightedMaterials: "yvo4_weightedMaterials",
  showMaterials: "yvo4_showMaterials",
  results: "yvo4_results",
};

function MainComponent() {
  const [selectedCompound, setSelectedCompound] = React.useState("yvo4");
  const [selectedDopants, setSelectedDopants] = React.useState([]);
  const [showMaterials, setShowMaterials] = React.useState(false);
  const [selectedSet, setSelectedSet] = React.useState(1);
  const [results, setResults] = React.useState(null);
  const [targetMol, setTargetMol] = React.useState("0.004");
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [concentrationSets, setConcentrationSets] =
    React.useState(createEmptySets);
  const [showPercentages, setShowPercentages] = React.useState({});
  const [weightedMaterials, setWeightedMaterials] =
    React.useState(createEmptySets);
  const [measuredValues, setMeasuredValues] = React.useState(createEmptySets);
  const [showReagentCalculation, setShowReagentCalculation] =
    React.useState(false);

  const compound = COMPOUNDS[selectedCompound];
  const availableDopants = React.useMemo(
    () =>
      Object.keys(DOPANTS).filter(
        (dopant) => dopant !== compound.hostElement
      ),
    [compound.hostElement]
  );

  const activeMaterials = React.useMemo(() => {
    const materialNames = [
      "V₂O₅",
      compound.hostOxide,
      ...availableDopants.map((dopant) => DOPANTS[dopant]),
    ];
    return [...new Set(materialNames)].map((name) => ({
      name,
      mass: MATERIALS[name],
    }));
  }, [availableDopants, compound.hostOxide]);

  React.useEffect(() => {
    try {
      const savedCompound = localStorage.getItem(STORAGE_KEYS.selectedCompound);
      const initialCompound = COMPOUNDS[savedCompound] ? savedCompound : "yvo4";
      const initialHostElement = COMPOUNDS[initialCompound].hostElement;
      setSelectedCompound(initialCompound);

      const savedSelectedDopants = localStorage.getItem(
        STORAGE_KEYS.selectedDopants
      );
      if (savedSelectedDopants) {
        setSelectedDopants(
          JSON.parse(savedSelectedDopants).filter(
            (dopant) => dopant !== initialHostElement
          )
        );
      }

      const savedTargetMol = localStorage.getItem(STORAGE_KEYS.targetMol);
      if (savedTargetMol) {
        setTargetMol(savedTargetMol);
      }

      const savedConcentrationSets = localStorage.getItem(
        STORAGE_KEYS.concentrationSets
      );
      if (savedConcentrationSets) {
        setConcentrationSets(
          pruneObjectKeyFromSets(
            JSON.parse(savedConcentrationSets),
            initialHostElement
          )
        );
      }

      const savedMeasuredValues = localStorage.getItem(
        STORAGE_KEYS.measuredValues
      );
      if (savedMeasuredValues) {
        setMeasuredValues(JSON.parse(savedMeasuredValues));
      }

      const savedWeightedMaterials = localStorage.getItem(
        STORAGE_KEYS.weightedMaterials
      );
      if (savedWeightedMaterials) {
        setWeightedMaterials(JSON.parse(savedWeightedMaterials));
      }

      const savedShowMaterials = localStorage.getItem(
        STORAGE_KEYS.showMaterials
      );
      if (savedShowMaterials) {
        setShowMaterials(JSON.parse(savedShowMaterials));
      }

      const savedResults = localStorage.getItem(STORAGE_KEYS.results);
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults);
        if (
          parsedResults.compoundKey === initialCompound ||
          (!parsedResults.compoundKey && initialCompound === "yvo4")
        ) {
          setResults(parsedResults);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.selectedCompound, selectedCompound);
    } catch (error) {
      console.error("Error saving selectedCompound to localStorage:", error);
    }
  }, [selectedCompound]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.selectedDopants,
        JSON.stringify(selectedDopants)
      );
    } catch (error) {
      console.error("Error saving selectedDopants to localStorage:", error);
    }
  }, [selectedDopants]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.targetMol, targetMol);
    } catch (error) {
      console.error("Error saving targetMol to localStorage:", error);
    }
  }, [targetMol]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.concentrationSets,
        JSON.stringify(concentrationSets)
      );
    } catch (error) {
      console.error("Error saving concentrationSets to localStorage:", error);
    }
  }, [concentrationSets]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.measuredValues,
        JSON.stringify(measuredValues)
      );
    } catch (error) {
      console.error("Error saving measuredValues to localStorage:", error);
    }
  }, [measuredValues]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.weightedMaterials,
        JSON.stringify(weightedMaterials)
      );
    } catch (error) {
      console.error("Error saving weightedMaterials to localStorage:", error);
    }
  }, [weightedMaterials]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.showMaterials,
        JSON.stringify(showMaterials)
      );
    } catch (error) {
      console.error("Error saving showMaterials to localStorage:", error);
    }
  }, [showMaterials]);

  React.useEffect(() => {
    try {
      if (results) {
        localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
      } else {
        localStorage.removeItem(STORAGE_KEYS.results);
      }
    } catch (error) {
      console.error("Error saving results to localStorage:", error);
    }
  }, [results]);

  const switchCompound = (compoundKey) => {
    if (compoundKey === selectedCompound) return;

    const nextCompound = COMPOUNDS[compoundKey];
    setSelectedCompound(compoundKey);
    setSelectedDopants((prev) =>
      prev.filter((dopant) => dopant !== nextCompound.hostElement)
    );
    setConcentrationSets((prev) =>
      pruneObjectKeyFromSets(prev, nextCompound.hostElement)
    );
    setResults(null);
    setErrorMessage("");
    setShowPercentages({});
  };

  const resetAllData = () => {
    try {
      setSelectedCompound("yvo4");
      setSelectedDopants([]);
      setShowMaterials(false);
      setSelectedSet(1);
      setResults(null);
      setTargetMol("0.004");
      setConcentrationSets(createEmptySets());
      setShowPercentages({});
      setWeightedMaterials(createEmptySets());
      setMeasuredValues(createEmptySets());
      setShowReagentCalculation(false);
      setErrorMessage("");

      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

  const formatDisplayValue = (num) => {
    const number = parseFloat(num);
    if (isNaN(number) || number === 0) return "0.0000";

    if (number > 0 && number < 0.001) {
      return number.toExponential(3);
    }

    return number.toFixed(4);
  };

  const handleDopantSelection = (dopant) => {
    if (!availableDopants.includes(dopant)) return;

    setResults(null);
    setSelectedDopants((prevSelected) => {
      if (prevSelected.includes(dopant)) {
        return prevSelected.filter((d) => d !== dopant);
      }
      return [...prevSelected, dopant];
    });

    setConcentrationSets((prev) => {
      const newSets = { ...prev };
      SET_NUMBERS.forEach((setNumber) => {
        const currentSet = { ...(newSets[setNumber] || {}) };
        if (selectedDopants.includes(dopant)) {
          delete currentSet[dopant];
        } else {
          currentSet[dopant] = 0;
        }
        newSets[setNumber] = currentSet;
      });
      return newSets;
    });
  };

  const handleConcentrationChange = (setNumber, dopant, value) => {
    setResults(null);

    if (value === "") {
      setConcentrationSets((prev) => ({
        ...prev,
        [setNumber]: { ...prev[setNumber], [dopant]: value },
      }));
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) return;

    if (value === ".") {
      value = "0.";
    }

    if (value.endsWith(".")) {
      const partialValue = value === "." ? "0." : value;
      const partialNumber = parseFloat(partialValue);
      if (!isNaN(partialNumber) && partialNumber <= 100) {
        setConcentrationSets((prev) => ({
          ...prev,
          [setNumber]: { ...prev[setNumber], [dopant]: partialValue },
        }));
      }
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newValue = Math.min(100, Math.max(0, numValue));
    setConcentrationSets((prev) => ({
      ...prev,
      [setNumber]: { ...prev[setNumber], [dopant]: String(newValue) },
    }));
  };

  const handleConcentrationFocus = (e, setNumber, dopant) => {
    setSelectedSet(setNumber);
    const value = String(concentrationSets[setNumber]?.[dopant] ?? "");
    const numericValue = parseFloat(value || 0);

    if (value === "" || (!isNaN(numericValue) && numericValue === 0)) {
      handleConcentrationChange(setNumber, dopant, "0.");
      window.requestAnimationFrame(() => {
        e.target.setSelectionRange(2, 2);
      });
    }
  };

  const handleConcentrationBlur = (e, setNumber, dopant) => {
    const value = e.target.value;
    if (value === "" || value === "0.") {
      handleConcentrationChange(setNumber, dopant, "0");
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const roundedValue = parseFloat(numValue.toFixed(3));
        handleConcentrationChange(setNumber, dopant, String(roundedValue));
      }
    }
  };

  const calculateMassesForSet = (setNumber, targetMetalMol) => {
    const setResult = { concentrations: {}, masses: {} };
    const currentSet = concentrationSets[setNumber] || {};
    const currentConcentrations = selectedDopants.reduce((set, dopant) => {
      if (dopant !== compound.hostElement) {
        set[dopant] = currentSet[dopant] ?? 0;
      }
      return set;
    }, {});

    const totalDopantConcentration = Object.values(
      currentConcentrations
    ).reduce((sum, concentration) => sum + parseFloat(concentration || 0), 0);

    setResult.concentrations.V = 50;
    Object.entries(currentConcentrations).forEach(([dopant, concentration]) => {
      setResult.concentrations[dopant] = parseFloat(concentration || 0);
    });
    setResult.concentrations[compound.hostElement] =
      50 - totalDopantConcentration;

    Object.entries(currentConcentrations).forEach(([dopant, concentration]) => {
      const oxide = DOPANTS[dopant];
      const dopantMetalMol =
        (targetMetalMol * parseFloat(concentration || 0)) / 100;
      const oxideMol = dopantMetalMol / 2;
      setResult.masses[oxide] = oxideMol * MATERIALS[oxide];
    });

    const hostMetalMol =
      (targetMetalMol * (100 - totalDopantConcentration)) / 100;
    const hostOxideMol = hostMetalMol / 2;
    setResult.masses[compound.hostOxide] =
      hostOxideMol * MATERIALS[compound.hostOxide];

    const vOxideMol = targetMetalMol / 2;
    setResult.masses["V₂O₅"] = vOxideMol * MATERIALS["V₂O₅"];

    return setResult;
  };

  const calculateReagentAmounts = (targetMetalMol) => {
    const baseAmounts = {
      nitricAcid: 5,
      water: 40,
      citricAcid: 3.3622,
      propyleneGlycol: 1.17,
    };
    const ratio = targetMetalMol / BASE_METAL_MOL;
    return {
      nitricAcid: (baseAmounts.nitricAcid * ratio).toFixed(2),
      water: (baseAmounts.water * ratio).toFixed(2),
      citricAcid: (baseAmounts.citricAcid * ratio).toFixed(4),
      propyleneGlycol: (baseAmounts.propyleneGlycol * ratio).toFixed(2),
    };
  };

  const calculateMasses = () => {
    setIsCalculating(true);
    setErrorMessage("");
    const targetMetalMol = parseFloat(targetMol);
    if (isNaN(targetMetalMol) || targetMetalMol <= 0) {
      setErrorMessage("目標モル数は正の数値を入力してください。");
      setIsCalculating(false);
      return;
    }

    const allResults = {
      compoundKey: selectedCompound,
      compoundFormula: compound.formula,
      targetMetalMol,
      1: calculateMassesForSet(1, targetMetalMol),
      2: calculateMassesForSet(2, targetMetalMol),
      3: calculateMassesForSet(3, targetMetalMol),
      4: calculateMassesForSet(4, targetMetalMol),
    };
    setResults(allResults);

    setTimeout(() => {
      setIsCalculating(false);
    }, 200);
  };

  const togglePercentages = (setNumber) => {
    setShowPercentages((prev) => ({ ...prev, [setNumber]: !prev[setNumber] }));
  };

  const toggleWeighted = (setNumber, material) => {
    setWeightedMaterials((prev) => ({
      ...prev,
      [setNumber]: {
        ...prev[setNumber],
        [material]: !prev[setNumber]?.[material],
      },
    }));
  };

  const getSetDescription = (setNumber) => {
    if (selectedDopants.length === 0) return "純粋系";

    const concentrations = concentrationSets[setNumber];
    if (!concentrations || Object.keys(concentrations).length === 0) return "";
    const descriptions = Object.entries(concentrations)
      .filter(([dopant, value]) => {
        return selectedDopants.includes(dopant) && parseFloat(value) > 0;
      })
      .map(([dopant, value]) => `${dopant} ${value}%`);
    return descriptions.length > 0 ? descriptions.join(", ") : "純粋系";
  };

  const exportToCSV = (setNumber) => {
    if (!results) return;

    let csvContent = "\ufeff";

    const timestamp = new Date()
      .toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "-");
    csvContent += `出力日時,${timestamp}\n`;
    csvContent += `化合物,${compound.formula}\n`;

    const headers = ["化合物", "セット", "材料", "計算値 (g)", "測定値 (g)"];
    csvContent += headers.join(",") + "\n";

    const allMeasurements = [];
    const setsToExport = setNumber ? [setNumber] : SET_NUMBERS;

    setsToExport.forEach((set) => {
      if (results[set]) {
        Object.entries(results[set].masses).forEach(
          ([material, calculatedValue]) => {
            allMeasurements.push({
              setNumber: set,
              material,
              calculatedValue: calculatedValue,
              measuredValue: parseFloat(measuredValues[set]?.[material] || 0),
            });
          }
        );
      }
    });

    csvContent += allMeasurements
      .map((m) =>
        [
          compound.formula,
          m.setNumber,
          m.material,
          formatDisplayValue(m.calculatedValue),
          m.measuredValue.toFixed(4),
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = setNumber
      ? `${compound.filePrefix}_measurements_set${setNumber}_${targetMol}mol.csv`
      : `${compound.filePrefix}_measurements_all_sets_${targetMol}mol.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMeasuredValueChange = (setNumber, material, value) => {
    setMeasuredValues((prev) => ({
      ...prev,
      [setNumber]: { ...prev[setNumber], [material]: value },
    }));
  };

  const totalDopantForSet = (setNumber) =>
    selectedDopants.reduce(
      (sum, dopant) =>
        sum + parseFloat(concentrationSets[setNumber]?.[dopant] || 0),
      0
    );

  const renderMaterialCalculation = (setNumber) => {
    const currentSet = concentrationSets[setNumber] || {};
    const totalDopantConcentration = totalDopantForSet(setNumber);
    const targetMetalMol = parseFloat(targetMol);
    const hostRatio = (100 - totalDopantConcentration) / 100;

    return (
      <div className="space-y-1.5">
        {selectedDopants.map((dopant) => {
          const concentration = currentSet[dopant] || 0;
          if (parseFloat(concentration || 0) <= 0) return null;

          const oxide = DOPANTS[dopant];
          const molarMass = MATERIALS[oxide];
          const concentrationDecimal = parseFloat(concentration) / 100;
          return (
            <div key={dopant}>
              {oxide}({concentration}%): {molarMass}[g/mol] × {targetMetalMol}
              [mol] ÷ 2 ×{" "}
              {concentrationDecimal < 0.01
                ? concentrationDecimal.toExponential(2)
                : concentrationDecimal.toFixed(3)}{" "}
              ={" "}
              {formatDisplayValue(
                ((molarMass * targetMetalMol) / 2) * concentrationDecimal
              )}
              [g]
            </div>
          );
        })}

        <div>
          {compound.hostOxide}({(100 - totalDopantConcentration).toFixed(1)}
          %): {MATERIALS[compound.hostOxide]}[g/mol] × {targetMetalMol}[mol] ÷
          2 × {hostRatio < 0.01 ? hostRatio.toExponential(2) : hostRatio.toFixed(3)} ={" "}
          {formatDisplayValue(
            ((MATERIALS[compound.hostOxide] * targetMetalMol) / 2) * hostRatio
          )}
          [g]
        </div>

        <div>
          V₂O₅: {MATERIALS["V₂O₅"]}[g/mol] × {targetMetalMol}[mol] ÷ 2 ={" "}
          {formatDisplayValue((MATERIALS["V₂O₅"] * targetMetalMol) / 2)}
          [g]
        </div>
      </div>
    );
  };

  const reagentAmounts = calculateReagentAmounts(parseFloat(targetMol) || 0);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-6 text-[#1d1d1f] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/85 px-5 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">
              Citrate complex method
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              YVO₄ / GdVO₄ 秤量計算ツール
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6e73] sm:text-base">
              母材を選び、4セット分の添加濃度と秤量値をまとめて管理できます。
            </p>
          </div>
          <div className="rounded-2xl border border-[#d2d2d7] bg-[#fbfbfd] px-4 py-3 text-sm">
            <div className="text-[#6e6e73]">現在の母材</div>
            <div className="mt-1 text-2xl font-semibold">{compound.formula}</div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">化合物選択</h2>
                <p className="mt-1 text-sm text-[#6e6e73]">
                  最初に母材を選択します。GdVO₄ではGdを添加物候補から外します。
                </p>
              </div>
              <div className="grid w-full max-w-full min-w-0 grid-cols-2 overflow-hidden rounded-full border border-[#d2d2d7] bg-[#f5f5f7] p-1 sm:w-auto">
                {Object.values(COMPOUNDS).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => switchCompound(item.key)}
                    className={`min-w-0 rounded-full px-3 py-2.5 text-sm font-semibold transition sm:px-5 ${
                      selectedCompound === item.key
                        ? "bg-white text-[#0071e3] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                        : "text-[#6e6e73] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {item.formula}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
            <label className="text-sm font-semibold text-[#1d1d1f]">
              目標モル数
            </label>
            <div className="mt-3 flex items-center rounded-2xl border border-[#d2d2d7] bg-[#fbfbfd] px-4 py-3 focus-within:border-[#0071e3]">
              <input
                type="number"
                value={targetMol}
                onChange={(e) => {
                  setTargetMol(e.target.value);
                  setResults(null);
                  setErrorMessage("");
                }}
                className="w-full bg-transparent text-2xl font-semibold outline-none"
                step="0.001"
                min="0"
                placeholder="0.004"
              />
              <span className="text-sm font-medium text-[#6e6e73]">mol</span>
            </div>
            {errorMessage && (
              <p className="mt-2 text-sm font-medium text-[#b42318]">
                {errorMessage}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">添加物選択</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">
                選択した添加物だけが濃度入力に表示されます。
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[#6e6e73]">
              {compound.tone}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7 xl:grid-cols-[repeat(14,minmax(0,1fr))]">
            {availableDopants.map((dopant) => (
              <button
                key={dopant}
                className={`min-h-11 rounded-2xl border px-3 text-sm font-semibold transition ${
                  selectedDopants.includes(dopant)
                    ? "border-[#0071e3] bg-[#0071e3] text-white shadow-sm"
                    : "border-[#d2d2d7] bg-[#fbfbfd] text-[#1d1d1f] hover:border-[#86868b]"
                }`}
                onClick={() => handleDopantSelection(dopant)}
              >
                {dopant}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">濃度設定</h2>
                <p className="mt-1 text-sm text-[#6e6e73]">
                  セットごとに添加濃度を入力します。未選択なら純粋系として計算します。
                </p>
              </div>
              <span className="text-sm font-medium text-[#6e6e73]">
                母材酸化物: {compound.hostOxide}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {SET_NUMBERS.map((setNumber) => {
                const hostBalance = 100 - totalDopantForSet(setNumber);
                return (
                  <div
                    key={setNumber}
                    className={`rounded-[22px] border p-4 transition ${
                      setNumber === selectedSet
                        ? "border-[#0071e3] bg-[#f5faff]"
                        : "border-[#d2d2d7] bg-[#fbfbfd]"
                    }`}
                    onClick={() => setSelectedSet(setNumber)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">
                          セット {setNumber}
                        </div>
                        <div className="mt-1 min-h-5 text-xs font-medium text-[#6e6e73]">
                          {getSetDescription(setNumber)}
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0071e3]">
                        {compound.hostElement} {hostBalance.toFixed(3)}%
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {selectedDopants.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#d2d2d7] bg-white px-3 py-4 text-sm text-[#6e6e73]">
                          添加物なしで計算できます。
                        </div>
                      ) : (
                        selectedDopants.map((dopant) => (
                          <label
                            key={dopant}
                            className="grid grid-cols-[34px_minmax(0,1fr)_20px] items-center gap-2 text-sm sm:grid-cols-[44px_minmax(0,1fr)_24px]"
                          >
                            <span className="font-semibold">{dopant}</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={concentrationSets[setNumber][dopant] ?? ""}
                              onChange={(e) =>
                                handleConcentrationChange(
                                  setNumber,
                                  dopant,
                                  e.target.value
                                )
                              }
                              onFocus={(e) =>
                                handleConcentrationFocus(e, setNumber, dopant)
                              }
                              onBlur={(e) =>
                                handleConcentrationBlur(e, setNumber, dopant)
                              }
                              onWheel={(e) => {
                                e.preventDefault();
                                const target = e.target;
                                target.focus();
                                const currentValue =
                                  parseFloat(
                                    concentrationSets[setNumber][dopant]
                                  ) || 0;
                                const delta = e.deltaY < 0 ? 0.001 : -0.001;
                                const rawValue = currentValue + delta;
                                const newValue = Math.min(
                                  100,
                                  Math.max(0, parseFloat(rawValue.toFixed(3)))
                                );
                                handleConcentrationChange(
                                  setNumber,
                                  dopant,
                                  String(newValue)
                                );
                              }}
                              className="h-10 rounded-xl border border-[#d2d2d7] bg-white px-3 text-right font-medium outline-none focus:border-[#0071e3]"
                              placeholder="0.000"
                            />
                            <span className="text-[#6e6e73]">%</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-lg font-semibold">実行</h2>
              <p className="mt-1 text-sm leading-6 text-[#6e6e73]">
                {compound.formula} の4セットをまとめて再計算します。
              </p>
              <div className="mt-5 grid gap-2">
                <button
                  onClick={calculateMasses}
                  className="min-h-12 rounded-2xl bg-[#0071e3] px-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:bg-[#86868b]"
                  disabled={isCalculating}
                >
                  {isCalculating ? "計算中..." : "計算する"}
                </button>
                <button
                  onClick={resetAllData}
                  className="min-h-11 rounded-2xl border border-[#d2d2d7] bg-white px-4 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
                >
                  リセット
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-5">
              <button
                onClick={() => setShowMaterials(!showMaterials)}
                className="flex w-full items-center justify-between text-left"
              >
                <span>
                  <span className="block text-lg font-semibold">分子量</span>
                  <span className="mt-1 block text-sm text-[#6e6e73]">
                    使用候補のみ表示
                  </span>
                </span>
                <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-sm font-semibold text-[#0071e3]">
                  {showMaterials ? "隠す" : "表示"}
                </span>
              </button>
              {showMaterials && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {activeMaterials.map(({ name, mass }) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-[#d2d2d7] bg-[#fbfbfd] px-3 py-2"
                    >
                      <div className="font-mono font-semibold">{name}</div>
                      <div className="mt-1 text-xs text-[#6e6e73]">
                        {mass} g/mol
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>

        {results && (
          <section className="rounded-[28px] border border-[#d2d2d7] bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  計算結果
                </h2>
                <p className="mt-1 text-sm text-[#6e6e73]">
                  {compound.formula} / 目標 {targetMol} mol
                </p>
              </div>
              <button
                onClick={() => exportToCSV(null)}
                className="min-h-11 w-full rounded-2xl border border-[#0071e3] bg-white px-4 text-sm font-semibold text-[#0071e3] transition hover:bg-[#f5faff] sm:w-auto"
              >
                全セットをCSV出力
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {SET_NUMBERS.map((setNumber) => (
                <div
                  key={setNumber}
                  className="rounded-[24px] border border-[#d2d2d7] bg-[#fbfbfd] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold">
                        セット {setNumber}
                      </div>
                      <div className="mt-1 break-words text-xs font-medium text-[#6e6e73]">
                        {getSetDescription(setNumber)}
                      </div>
                    </div>
                    <button
                      onClick={() => exportToCSV(setNumber)}
                      className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0071e3] shadow-sm"
                    >
                      CSV
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {Object.entries(results[setNumber].masses).map(
                      ([material, calculatedValue]) => (
                        <div
                          key={material}
                          className="rounded-2xl border border-[#d2d2d7] bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 font-mono text-sm font-semibold">
                              {material}
                            </span>
                            <span className="shrink-0 text-right text-sm font-semibold">
                              {formatDisplayValue(calculatedValue)} g
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                            <input
                              type="number"
                              value={measuredValues[setNumber]?.[material] || ""}
                              onChange={(e) =>
                                handleMeasuredValueChange(
                                  setNumber,
                                  material,
                                  e.target.value
                                )
                              }
                              placeholder="測定値"
                              className="h-10 min-w-0 rounded-xl border border-[#d2d2d7] px-3 text-sm outline-none focus:border-[#0071e3]"
                              step="0.0001"
                            />
                            <button
                              onClick={() =>
                                handleMeasuredValueChange(
                                  setNumber,
                                  material,
                                  calculatedValue.toFixed(4)
                                )
                              }
                              className="h-10 rounded-xl bg-[#f5f5f7] px-3 text-xs font-semibold text-[#1d1d1f]"
                            >
                              ピッタリ
                            </button>
                            <button
                              aria-label={`${material} weighed`}
                              onClick={() => toggleWeighted(setNumber, material)}
                              className={`col-span-2 flex h-10 w-full items-center justify-center rounded-xl border text-sm font-bold transition sm:col-span-1 sm:w-10 ${
                                weightedMaterials[setNumber]?.[material]
                                  ? "border-[#34c759] bg-[#34c759] text-white"
                                  : "border-[#d2d2d7] bg-white text-transparent"
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[24px] border border-[#d2d2d7] bg-[#fbfbfd] p-4">
                <h3 className="text-lg font-semibold">全体の割合</h3>
                <div className="mt-3 space-y-2">
                  {SET_NUMBERS.map((setNumber) => (
                    <div
                      key={setNumber}
                      className="overflow-hidden rounded-2xl border border-[#d2d2d7] bg-white"
                    >
                      <button
                        onClick={() => togglePercentages(setNumber)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
                      >
                        <span>
                          セット {setNumber}: {getSetDescription(setNumber)}
                        </span>
                        <span className="text-[#0071e3]">
                          {showPercentages[setNumber] ? "閉じる" : "表示"}
                        </span>
                      </button>
                      {showPercentages[setNumber] && (
                        <div className="grid grid-cols-2 gap-2 border-t border-[#d2d2d7] bg-[#fbfbfd] p-3 sm:grid-cols-4">
                          {Object.entries(
                            results[setNumber].concentrations
                          ).map(([element, concentration]) => (
                            <div key={element} className="text-sm">
                              <span className="font-semibold">{element}</span>{" "}
                              {Number(concentration).toFixed(3)}%
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#d2d2d7] bg-[#fbfbfd] p-4">
                <h3 className="text-lg font-semibold">必要な試薬の量</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-3 text-sm">
                    <span className="font-semibold">硝酸</span>
                    <div className="mt-1 text-lg font-semibold">
                      {reagentAmounts.nitricAcid} ml
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm">
                    <span className="font-semibold">純水</span>
                    <div className="mt-1 text-lg font-semibold">
                      {reagentAmounts.water} ml
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm">
                    <span className="font-semibold">クエン酸水和物</span>
                    <div className="mt-1 text-lg font-semibold">
                      {reagentAmounts.citricAcid} g
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm">
                    <span className="font-semibold">
                      プロピレングリコール
                    </span>
                    <div className="mt-1 text-lg font-semibold">
                      {reagentAmounts.propyleneGlycol} ml
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowReagentCalculation(!showReagentCalculation)
                  }
                  className="mt-4 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#0071e3]"
                >
                  {showReagentCalculation ? "計算過程を隠す" : "計算過程を表示"}
                </button>

                {showReagentCalculation && (
                  <div className="mt-4 max-h-[480px] overflow-auto rounded-2xl border border-[#d2d2d7] bg-white p-4 text-sm leading-6 text-[#424245]">
                    <h4 className="text-base font-semibold text-[#1d1d1f]">
                      計算過程（{compound.formula} / {targetMol} mol）
                    </h4>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="font-semibold text-[#1d1d1f]">
                          材料の計算
                        </div>
                        <div className="mt-2 space-y-4">
                          {SET_NUMBERS.map((setNumber) => (
                            <div key={setNumber}>
                              <div className="font-semibold">
                                セット {setNumber}
                              </div>
                              <div className="mt-1">
                                {renderMaterialCalculation(setNumber)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-[#1d1d1f]">
                          クエン酸水和物の計算
                        </div>
                        <div>
                          210.14 [g/mol] ×{" "}
                          {(parseFloat(targetMol) * 2).toFixed(3)} [mol] × 2 ={" "}
                          {(210.14 * parseFloat(targetMol) * 2 * 2).toFixed(4)}{" "}
                          [g]
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1d1d1f]">
                          プロピレングリコールの計算
                        </div>
                        <div>
                          76.00 [g/mol] ×{" "}
                          {(parseFloat(targetMol) * 2).toFixed(3)} [mol] × 2 ÷
                          1.04 [g/ml] ={" "}
                          {(
                            (76.0 * parseFloat(targetMol) * 2 * 2) /
                            1.04
                          ).toFixed(2)}{" "}
                          [ml]
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1d1d1f]">
                          硝酸・純水の計算
                        </div>
                        <div>
                          硝酸: 5.00 ml × ({parseFloat(targetMol)} ÷ 0.004) ={" "}
                          {((5.0 * parseFloat(targetMol)) / 0.004).toFixed(2)}{" "}
                          ml
                        </div>
                        <div>
                          純水: 40.00 ml × ({parseFloat(targetMol)} ÷ 0.004) ={" "}
                          {((40.0 * parseFloat(targetMol)) / 0.004).toFixed(2)}{" "}
                          ml
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MainComponent;
