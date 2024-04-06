import CommonComponents from "../../react/components/CommonComponents";

export default class CustomSettingListBuilder {
    constructor() {
        this.sections = [];
    }

    withSection(label, ...settings) {
        this.sections.push({ label: label, settings: settings });
        return this;
    }

    build() {
        const SettingsList = CommonComponents.getComponent("SettingsList");
        return <SettingsList sections={this.sections} />;
    }
}