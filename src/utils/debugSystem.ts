const debugCategories = {
  spawner: "spawner",
  character: "character",
  rangeWeapon: "rangeWeapon",
};

type TDebugCategory = keyof typeof debugCategories;

const DebugSystem: TDebugSystem = {
  enabledCategories: [],
  isCategoryEnabled(category: TDebugCategory) {
    return DebugSystem.enabledCategories.includes(category);
  },
  enableCategory(category: TDebugCategory) {
    const shouldDisable = DebugSystem.isCategoryEnabled(category);
    if (shouldDisable) {
      DebugSystem.enabledCategories = DebugSystem.enabledCategories.filter(
        (c) => c !== category
      );
    } else {
      DebugSystem.enabledCategories.push(category);
    }

    console.info(
      `[debugSubsystem] debug category '${category}' ${
        shouldDisable ? "disabled" : "enabled"
      }`
    );
  },
};

window.debugSystem = DebugSystem;

export default DebugSystem;
