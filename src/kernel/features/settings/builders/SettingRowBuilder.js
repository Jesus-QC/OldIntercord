import AssetManager from "../../assets/AssetManager";

export default class SettingRowBuilder{
    constructor(title, parent = undefined){
        this.title = title;
        this.parent = parent;
        this.type = "static";
    }

    withIconName(iconName)  {
        this.iconName = iconName;
        return this;
    }

    withIcon(iconId){
        this.icon = iconId;
        return this;
    }
    
    withDescription(descriptionCallback)  {
        this.useDescription = descriptionCallback;
        return this;
    }
    
    withTrailing(trailingCallback)  {
        this.useTrailing = trailingCallback;
        return this;
    }
    
    withPredicate(predicateCallback)  {
        this.usePredicate = predicateCallback;
        return this;
    }
    
    withDisabled(disabledCallback)  {
        this.useDisabled = disabledCallback;
        return this;
    }
    
    withPreNavigationAction(action)  {
        this.preNavigationAction = action;
        return this;
    }
    
    useArrow(value = true)  {
        this.withArrow = value;
        return this;
    }
    
    withRoute(route, component)  {
        this.type = "route";
        this.screen = {
            route: route,
            getComponent: () => component,
        }
        return this;
    }
    
    withToggle(onValueChange, useValue)  {
        this.type = "toggle";
        this.useValue = useValue;
        this.onValueChange = onValueChange;
        return this;
    }
    
    withRadio(useOptions, onValueChange, useValue)  {
        this.type = "radio";
        this.useValue = useValue;
        this.useOptions = useOptions;
        this.onValueChange = onValueChange;
        return this;
    }
    
    withPressable(onPress)  {
        this.type = "pressable";
        this.onPress = onPress;
        return this;
    }

    build()  {
        return {
            title: this.title,
            parent: this.parent,
            type: this.type,
            icon: this.icon === undefined ? AssetManager.getAssetIdByName(this.iconName) : this.icon,
            screen: this.screen,
            useValue: this.useValue,
            useOptions: this.useOptions,
            onValueChange: this.onValueChange,
            onPress: this.onPress,
            useDescription: this.useDescription,
            usePredicate: this.usePredicate,
            useDisabled: this.useDisabled,
            useTrailing: this.useTrailing,
            withArrow: this.withArrow,
            preNavigationAction: this.preNavigationAction,
        };
    }
}