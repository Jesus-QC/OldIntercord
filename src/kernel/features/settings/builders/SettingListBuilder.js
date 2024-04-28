export default class SettingListBuilder{
    constructor(label = undefined) {
        this.label = label;
        this.panels = [];
    }

    withPanels(...panels) {
        this.panels = panels;
        return this;
    }
    
    build() {
        return {
            label: this.label,
            panels: this.panels,
        }
    }
}