export default class SettingListSectionsBuilder {
    constructor() {
        this.sections = [];
    }

    withSection(label, ...settings) {
        this.sections.push({ label: label, settings: settings });
        return this;
    }

    build() {
        return this.sections;
    }
}