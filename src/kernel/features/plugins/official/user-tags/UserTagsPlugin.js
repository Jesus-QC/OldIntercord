import LazyModuleLoader from "../../../modules/LazyModuleLoader";
import InterPatcher from "../../../patcher/InterPatcher";
import ModuleSearcher from "../../../modules/ModuleSearcher";

export default class UserTagsPlugin{
    constructor() {
        this.prefix = "user-tags";
        this.name = "User Tags";
        this.description = "Adds more tags to users based on their permissions.";
        this.author = "@jesusqc";
        this.repo = ""; // TODO
        this.requiresRestart = true;
    }

    load(){
        LazyModuleLoader.waitForModuleByProps((module) => {
            // this.patchRowRenderer(module);
        }, "MockChatManager");
    }

    patchRowRenderer(module){
        LazyModuleLoader.waitForStores((selectedGuildStore, guildStore, selectedChannelStore, channelStore, userStore) => {
            InterPatcher.addPrefix(module.default.prototype, "createRow", (data) => {
                const args = data.args[0];

                if (!args.message) return;
                const user = userStore.getUser(args.message.authorId);
                const channel = channelStore.getChannel(args.channelId);
                const guild = guildStore.getGuild(args.guildId);

                getUserTag(user, guild, channel.permissionOverwrites);

                if (!args.message.tagText) args.message.tagText = "OWNER";
                else args.message.tagText += " • OWNER";
            });
        }, "SelectedGuildStore", "GuildStore", "SelectedChannelStore", "ChannelStore", "UserStore");
    }
}

function getUserTag(user, context, overwrites){
    const permissions = ModuleSearcher.findByProps("ALLOW", "DENY").computePermissions({user, context, overwrites});
    console.log("intercord", JSON.stringify(permissions));
}