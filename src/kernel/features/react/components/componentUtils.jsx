import SettingsManager from "../../files/SettingsManager";

export function useSetting(prefix, key, defaultValue){
    const [setting, setSetting] = React.useState(defaultValue);

    React.useEffect(() => {
        SettingsManager.get(prefix, key, (value) => {
            if (value !== undefined) setSetting(value);
        });
    }, [prefix, key]);

    return [setting, (value) => {
        setSetting(value);
        SettingsManager.set(prefix, key, value);
    }]
}
