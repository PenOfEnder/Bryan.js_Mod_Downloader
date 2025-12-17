class ModListManager {
    mods = $state([]);

    constructor() {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("mod_list");
            if (saved) {
                this.mods = JSON.parse(saved);
            }
        }

        $effect.root(() => {
            $effect(() => {
                localStorage.setItem("mod_list", JSON.stringify(this.mods));
                console.log("Mod list saved");
            })
        })
    }

    addMod(mod) {
        this.mods.push(mod);
    }

    removeModFromIndex(index) {
        this.mods.splice(index, 1);
    }
}

export const modListStore = new ModListManager();