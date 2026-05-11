"use client";
import React from "react";

function MainComponent() {
  const [selectedDopants, setSelectedDopants] = React.useState([]);
  const [showMaterials, setShowMaterials] = React.useState(false);
  const [selectedSet, setSelectedSet] = React.useState(1);
  const [results, setResults] = React.useState(null);
  const [targetMol, setTargetMol] = React.useState("0.004");
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [concentrationSets, setConcentrationSets] = React.useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });
  const [showPercentages, setShowPercentages] = React.useState({});
  const [weightedMaterials, setWeightedMaterials] = React.useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });
  const [measuredValues, setMeasuredValues] = React.useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });
  const [showReagentCalculation, setShowReagentCalculation] =
    React.useState(false);

  // LocalStorage keys
  const STORAGE_KEYS = {
    selectedDopants: "yvo4_selectedDopants",
    targetMol: "yvo4_targetMol",
    concentrationSets: "yvo4_concentrationSets",
    measuredValues: "yvo4_measuredValues",
    weightedMaterials: "yvo4_weightedMaterials",
    showMaterials: "yvo4_showMaterials",
    results: "yvo4_results",
  };

  // Load data from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedSelectedDopants = localStorage.getItem(
        STORAGE_KEYS.selectedDopants
      );
      if (savedSelectedDopants) {
        setSelectedDopants(JSON.parse(savedSelectedDopants));
      }

      const savedTargetMol = localStorage.getItem(STORAGE_KEYS.targetMol);
      if (savedTargetMol) {
        setTargetMol(savedTargetMol);
      }

      const savedConcentrationSets = localStorage.getItem(
        STORAGE_KEYS.concentrationSets
      );
      if (savedConcentrationSets) {
        setConcentrationSets(JSON.parse(savedConcentrationSets));
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
        setResults(JSON.parse(savedResults));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save selectedDopants to localStorage
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

  // Save targetMol to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.targetMol, targetMol);
    } catch (error) {
      console.error("Error saving targetMol to localStorage:", error);
    }
  }, [targetMol]);

  // Save concentrationSets to localStorage
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

  // Save measuredValues to localStorage
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

  // Save weightedMaterials to localStorage
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

  // Save showMaterials to localStorage
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

  // Save results to localStorage
  React.useEffect(() => {
    try {
      if (results) {
        localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
      }
    } catch (error) {
      console.error("Error saving results to localStorage:", error);
    }
  }, [results]);

  const baseMetalMol = 0.004;

  const dopants = {
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

  const materials = {
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

  const resetAllData = () => {
    try {
      setSelectedDopants([]);
      setShowMaterials(false);
      setSelectedSet(1);
      setResults(null);
      setTargetMol("0.004");
      setConcentrationSets({
        1: {},
        2: {},
        3: {},
        4: {},
      });
      setShowPercentages({});
      setWeightedMaterials({
        1: {},
        2: {},
        3: {},
        4: {},
      });
      setMeasuredValues({
        1: {},
        2: {},
        3: {},
        4: {},
      });
      setShowReagentCalculation(false);

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
    if (selectedDopants.includes(dopant)) {
      setSelectedDopants(selectedDopants.filter((d) => d !== dopant));
      setConcentrationSets((prev) => {
        const newSets = { ...prev };
        [1, 2, 3, 4].forEach((setNumber) => {
          const newSet = { ...newSets[setNumber] };
          delete newSet[dopant];
          newSets[setNumber] = newSet;
        });
        return newSets;
      });
    } else {
      setSelectedDopants([...selectedDopants, dopant]);
      setConcentrationSets((prev) => {
        const newSets = { ...prev };
        [1, 2, 3, 4].forEach((setNumber) => {
          newSets[setNumber] = { ...newSets[setNumber], [dopant]: 0 };
        });
        return newSets;
      });
    }
  };

  const handleConcentrationChange = (setNumber, dopant, value) => {
    if (value === "") {
      setConcentrationSets((prev) => ({
        ...prev,
        [setNumber]: { ...prev[setNumber], [dopant]: value },
      }));
      return;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newValue = Math.min(100, Math.max(0, numValue));
    setConcentrationSets((prev) => ({
      ...prev,
      [setNumber]: { ...prev[setNumber], [dopant]: newValue },
    }));
  };

  const handleConcentrationBlur = (e, setNumber, dopant) => {
    const value = e.target.value;
    if (value === "") {
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
    const results = { concentrations: {}, masses: {} };
    const currentSet = concentrationSets[setNumber];
    const currentConcentrations = { ...currentSet };

    const totalDopantConcentration = Object.values(
      currentConcentrations
    ).reduce((sum, concentration) => sum + parseFloat(concentration || 0), 0);

    results.concentrations.V = 50;
    Object.entries(currentConcentrations).forEach(([dopant, concentration]) => {
      results.concentrations[dopant] = parseFloat(concentration || 0);
    });
    results.concentrations.Y = 50 - totalDopantConcentration;

    Object.entries(currentConcentrations).forEach(([dopant, concentration]) => {
      const oxide = dopants[dopant];
      const dopantMetalMol =
        (targetMetalMol * parseFloat(concentration || 0)) / 100;
      const oxideMol = dopantMetalMol / 2;
      results.masses[oxide] = oxideMol * materials[oxide];
    });

    const yMetalMol = (targetMetalMol * (100 - totalDopantConcentration)) / 100;
    const yOxideMol = yMetalMol / 2;
    results.masses["Y₂O₃"] = yOxideMol * materials["Y₂O₃"];

    const vOxideMol = targetMetalMol / 2;
    results.masses["V₂O₅"] = vOxideMol * materials["V₂O₅"];

    return results;
  };

  const calculateReagentAmounts = (targetMetalMol) => {
    const baseAmounts = {
      nitricAcid: 5,
      water: 40,
      citricAcid: 3.3622,
      propyleneGlycol: 1.17,
    };
    const ratio = targetMetalMol / baseMetalMol;
    return {
      nitricAcid: (baseAmounts.nitricAcid * ratio).toFixed(2),
      water: (baseAmounts.water * ratio).toFixed(2),
      citricAcid: (baseAmounts.citricAcid * ratio).toFixed(4),
      propyleneGlycol: (baseAmounts.propyleneGlycol * ratio).toFixed(2),
    };
  };

  const calculateMasses = () => {
    setIsCalculating(true);
    const targetMetalMol = parseFloat(targetMol);
    if (isNaN(targetMetalMol) || targetMetalMol <= 0) {
      console.error("目標モル数は正の数値を入力してください。");
      setIsCalculating(false);
      return;
    }

    const allResults = {
      1: calculateMassesForSet(1, targetMetalMol),
      2: calculateMassesForSet(2, targetMetalMol),
      3: calculateMassesForSet(3, targetMetalMol),
      4: calculateMassesForSet(4, targetMetalMol),
    };
    setResults(allResults);

    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
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
    const concentrations = concentrationSets[setNumber];
    if (!concentrations || Object.keys(concentrations).length === 0) return "";
    const descriptions = Object.entries(concentrations)
      .filter(([_, value]) => parseFloat(value) > 0)
      .map(([dopant, value]) => `${dopant} ${value}%`);
    return descriptions.length > 0 ? ` (${descriptions.join(", ")})` : "";
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

    const headers = ["セット", "材料", "計算値 (g)", "測定値 (g)"];
    csvContent += headers.join(",") + "\n";

    const allMeasurements = [];
    const setsToExport = setNumber ? [setNumber] : [1, 2, 3, 4];

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
      ? `measurements_set${setNumber}_${targetMol}mol.csv`
      : `measurements_all_sets_${targetMol}mol.csv`;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          YVO₄ 秤量計算ツール
        </h1>
        <p className="text-base text-gray-600 mb-8 text-center">
          クエン酸錯体重合法による合成
        </p>

        <div className="space-y-8">
          <div>
            <label className="block text-md font-medium text-gray-700 mb-3">
              添加物選択
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {Object.keys(dopants).map((dopant) => (
                <button
                  key={dopant}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    selectedDopants.includes(dopant)
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => handleDopantSelection(dopant)}
                >
                  {dopant}
                </button>
              ))}
            </div>
          </div>

          {selectedDopants.length > 0 && (
            <div>
              <label className="block text-md font-medium text-gray-700 mb-3">
                濃度設定 (%)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((setNumber) => (
                  <div
                    key={setNumber}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      setNumber === selectedSet
                        ? "border-blue-500 bg-blue-50 shadow-inner"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedSet(setNumber)}
                  >
                    <div className="text-lg font-bold mb-3 text-gray-800">
                      セット {setNumber}
                      <span className="text-sm font-normal text-gray-600">
                        {getSetDescription(setNumber)}
                      </span>
                    </div>
                    {selectedDopants.map((dopant) => (
                      <div
                        key={dopant}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <label className="text-sm font-medium w-12">
                          {dopant}:
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={concentrationSets[setNumber][dopant] ?? ""}
                            onChange={(e) =>
                              handleConcentrationChange(
                                setNumber,
                                dopant,
                                e.target.value
                              )
                            }
                            onFocus={() => setSelectedSet(setNumber)}
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
                            className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="0.001"
                            min="0"
                            max="100"
                            placeholder="0.000"
                          />
                        </div>
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              目標モル数 (mol)
            </label>
            <input
              type="number"
              value={targetMol}
              onChange={(e) => setTargetMol(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.001"
              placeholder="例: 0.004"
            />
          </div>

          <button
            onClick={() => setShowMaterials(!showMaterials)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showMaterials ? "分子量を隠す" : "分子量を表示"}
          </button>

          {showMaterials && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                使用材料の分子量
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                {Object.entries(materials).map(([name, mass]) => (
                  <div key={name} className="text-sm text-gray-700">
                    <span className="font-mono font-medium">{name}:</span>{" "}
                    {mass} g/mol
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={calculateMasses}
              className={`flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                isCalculating || selectedDopants.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl focus:ring-blue-500"
              }`}
              disabled={selectedDopants.length === 0 || isCalculating}
            >
              {isCalculating ? "計算中..." : "計算する"}
            </button>

            <button
              onClick={resetAllData}
              className="py-3 px-6 rounded-lg text-lg font-bold bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
              リセット
            </button>
          </div>

          {results && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                計算結果
              </h2>

              <div className="mb-4">
                <button
                  onClick={() => exportToCSV(null)}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md text-sm hover:bg-green-700 active:bg-green-800 transition-colors"
                >
                  全セットをCSVエクスポート
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  必要な材料量 (g)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((setNumber) => (
                    <div
                      key={setNumber}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <div className="font-bold text-gray-800 text-lg mb-3">
                        セット {setNumber}
                        <span className="text-sm font-normal text-gray-600">
                          {getSetDescription(setNumber)}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(results[setNumber].masses).map(
                          ([material, calculatedValue]) => (
                            <div key={material} className="space-y-1.5">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-mono">
                                  {material}:
                                </span>
                                <span className="font-medium text-right">
                                  {formatDisplayValue(calculatedValue)} g
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={
                                    measuredValues[setNumber]?.[material] || ""
                                  }
                                  onChange={(e) =>
                                    handleMeasuredValueChange(
                                      setNumber,
                                      material,
                                      e.target.value
                                    )
                                  }
                                  placeholder="測定値"
                                  className="flex-grow w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
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
                                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 whitespace-nowrap transition-colors"
                                >
                                  ピッタリ
                                </button>
                                <span
                                  className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 ${
                                    weightedMaterials[setNumber]?.[material]
                                      ? "bg-green-500 border-green-600 text-white"
                                      : "border-gray-300 bg-white hover:border-gray-400"
                                  }`}
                                  onClick={() =>
                                    toggleWeighted(setNumber, material)
                                  }
                                >
                                  {weightedMaterials[setNumber]?.[material] && (
                                    <span className="text-xs font-bold">✓</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => exportToCSV(setNumber)}
                          className="px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-md text-xs hover:bg-green-200 transition-colors"
                        >
                          このセットをCSV出力
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[1, 2, 3, 4].map((setNumber) => (
                  <div
                    key={setNumber}
                    className="bg-white rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      onClick={() => togglePercentages(setNumber)}
                      className="w-full px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span>
                        セット {setNumber}
                        {getSetDescription(setNumber)} の全体の割合 (%)
                      </span>
                      <span
                        className={`transform transition-transform duration-200 ${
                          showPercentages[setNumber] ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {showPercentages[setNumber] && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(
                            results[setNumber].concentrations
                          ).map(([element, concentration]) => (
                            <div key={element} className="text-sm">
                              <span className="font-medium">{element}:</span>{" "}
                              {Number(concentration).toFixed(3)}%
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  必要な試薬の量
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const reagentAmounts = calculateReagentAmounts(
                      parseFloat(targetMol)
                    );
                    return (
                      <>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <span className="font-medium">硝酸:</span>{" "}
                          {reagentAmounts.nitricAcid} ml
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <span className="font-medium">純水:</span>{" "}
                          {reagentAmounts.water} ml
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <span className="font-medium">クエン酸水和物:</span>{" "}
                          {reagentAmounts.citricAcid} g
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <span className="font-medium">
                            プロピレングリコール:
                          </span>{" "}
                          {reagentAmounts.propyleneGlycol} ml
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      setShowReagentCalculation(!showReagentCalculation)
                    }
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showReagentCalculation
                      ? "計算過程を隠す"
                      : "計算過程を表示"}
                  </button>
                </div>

                {showReagentCalculation && (
                  <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      計算過程（目標モル数: {targetMol} mol）
                    </h4>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">
                          材料の計算:
                        </div>
                        <div className="pl-4 space-y-2">
                          {[1, 2, 3, 4].map((setNumber) => {
                            const currentSet = concentrationSets[setNumber];
                            const totalDopantConcentration = Object.values(
                              currentSet
                            ).reduce(
                              (sum, concentration) =>
                                sum + parseFloat(concentration || 0),
                              0
                            );
                            const targetMetalMol = parseFloat(targetMol);

                            return (
                              <div key={setNumber} className="mb-4">
                                <div className="font-medium text-gray-800 mb-1">
                                  セット {setNumber}:
                                </div>
                                <div className="pl-2 space-y-1">
                                  {Object.entries(currentSet).map(
                                    ([dopant, concentration]) => {
                                      if (parseFloat(concentration || 0) > 0) {
                                        const oxide = dopants[dopant];
                                        const molarMass = materials[oxide];
                                        const concentrationDecimal =
                                          parseFloat(concentration) / 100;
                                        return (
                                          <div key={dopant}>
                                            {oxide}({concentration}%):{" "}
                                            {molarMass}[g/mol] ×{" "}
                                            {targetMetalMol}[mol] ÷ 2 ×{" "}
                                            {concentrationDecimal < 0.01
                                              ? concentrationDecimal.toExponential(
                                                  2
                                                )
                                              : concentrationDecimal.toFixed(
                                                  3
                                                )}{" "}
                                            ={" "}
                                            {formatDisplayValue(
                                              ((molarMass * targetMetalMol) /
                                                2) *
                                                concentrationDecimal
                                            )}
                                            [g]
                                          </div>
                                        );
                                      }
                                      return null;
                                    }
                                  )}

                                  <div>
                                    Y₂O₃(
                                    {(100 - totalDopantConcentration).toFixed(
                                      1
                                    )}
                                    %): {materials["Y₂O₃"]}[g/mol] ×{" "}
                                    {targetMetalMol}[mol] ÷ 2 ×{" "}
                                    {(100 - totalDopantConcentration) / 100 <
                                    0.01
                                      ? (
                                          (100 - totalDopantConcentration) /
                                          100
                                        ).toExponential(2)
                                      : (
                                          (100 - totalDopantConcentration) /
                                          100
                                        ).toFixed(3)}{" "}
                                    ={" "}
                                    {formatDisplayValue(
                                      ((materials["Y₂O₃"] * targetMetalMol) /
                                        2) *
                                        ((100 - totalDopantConcentration) / 100)
                                    )}
                                    [g]
                                  </div>

                                  <div>
                                    V₂O₅: {materials["V₂O₅"]}[g/mol] ×{" "}
                                    {targetMetalMol}[mol] ÷ 2 ={" "}
                                    {formatDisplayValue(
                                      (materials["V₂O₅"] * targetMetalMol) / 2
                                    )}
                                    [g]
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-gray-800 mb-2">
                          クエン酸水和物の計算:
                        </div>
                        <div className="pl-4 space-y-1">
                          <div>
                            モル質量 × 金属イオンの物質量(目標モル数×2) × 2
                          </div>
                          <div>
                            210.14 [g/mol] ×{" "}
                            {(parseFloat(targetMol) * 2).toFixed(3)} [mol] × 2 ={" "}
                            {(210.14 * parseFloat(targetMol) * 2 * 2).toFixed(
                              4
                            )}{" "}
                            [g]
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">
                          プロピレングリコールの計算:
                        </div>
                        <div className="pl-4 space-y-1">
                          <div>
                            モル質量 × 金属イオンの物質量(目標モル数×2) × 2 ÷
                            比重
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
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 mb-2">
                          硝酸・純水の計算:
                        </div>
                        <div className="pl-4 space-y-1">
                          <div>
                            目標モル数に応じて比例計算（基準値: 0.004 mol）
                          </div>
                          <div>
                            硝酸: 5.00 ml × ({parseFloat(targetMol)} ÷ 0.004) ={" "}
                            {((5.0 * parseFloat(targetMol)) / 0.004).toFixed(2)}{" "}
                            ml
                          </div>
                          <div>
                            純水: 40.00 ml × ({parseFloat(targetMol)} ÷ 0.004) ={" "}
                            {((40.0 * parseFloat(targetMol)) / 0.004).toFixed(
                              2
                            )}{" "}
                            ml
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
