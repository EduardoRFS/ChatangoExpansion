//modules link to internal extension files
function linkInternalModules() {
    chatango.group.moduleInfo.modulePrefix_ = document.getElementsByTagName("script")[0].src.split("/js/gz")[0] + "/js/gz/" + chatango.settings.version.RevisionNumber.getInstance().getModulesRevision();
    chatango.group.moduleInfo.MODULE_URIS = {
        "shell": ["Shell.js"],
        "CommonCoreModule": [chatango.group.moduleInfo.modulePrefix_ + "/CommonCoreModule.js"],
        "Group": [chatango.group.moduleInfo.modulePrefix_ + "/Group.js"],
        "PmModule": [chatango.group.moduleInfo.modulePrefix_ + "/PmModule.js"],
        "CollapsedViewModule": [chatango.group.moduleInfo.modulePrefix_ + "/CollapsedViewModule.js"],
        "LoginModule": [chatango.group.moduleInfo.modulePrefix_ + "/LoginModule.js"],
        "ChatangoMediaModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/ChatangoMediaModule.js"],
        "MoreInfoModule": [chatango.group.moduleInfo.modulePrefix_ + "/MoreInfoModule.js"],
        "VideoModule": [chatango.group.moduleInfo.modulePrefix_ + "/VideoModule.js"],
        "CommonUIModule": [chatango.group.moduleInfo.modulePrefix_ + "/CommonUIModule.js"],
        "SettingsModule": [chatango.group.moduleInfo.modulePrefix_ + "/SettingsModule.js"],
        "ModerationModule": [chatango.group.moduleInfo.modulePrefix_ + "/ModerationModule.js"],
        "RateRestrictionsModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/RateRestrictionsModule.js"],
        "BannedUsersModule": [chatango.group.moduleInfo.modulePrefix_ + "/BannedUsersModule.js"],
        "ManageModsModule": [chatango.group.moduleInfo.modulePrefix_ + "/ManageModsModule.js"],
        "ModActionsModule": [chatango.group.moduleInfo.modulePrefix_ + "/ModActionsModule.js"],
        "EditGroupModule": [chatango.group.moduleInfo.modulePrefix_ + "/EditGroupModule.js"],
        "ChatRestrictionsModule": [chatango.group.moduleInfo.modulePrefix_ + "/ChatRestrictionsModule.js"],
        "ContentControlModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/ContentControlModule.js"],
        "AnnouncementsModule": [chatango.group.moduleInfo.modulePrefix_ + "/AnnouncementsModule.js"],
        "SupportChatangoModule": [chatango.group.moduleInfo.modulePrefix_ + "/SupportChatangoModule.js"],
        "MockGroupModule": [chatango.group.moduleInfo.modulePrefix_ + "/MockGroupModule.js"],
        "FtrIconMenuModule": [chatango.group.moduleInfo.modulePrefix_ + "/FtrIconMenuModule.js"],
        "LogoMenuModule": [chatango.group.moduleInfo.modulePrefix_ + "/LogoMenuModule.js"],
        "ShareMenuModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/ShareMenuModule.js"],
        "EditProfileModule": [chatango.group.moduleInfo.modulePrefix_ + "/EditProfileModule.js"],
        "MessageCatcherModule": [chatango.group.moduleInfo.modulePrefix_ + "/MessageCatcherModule.js"],
        "UploadMediaModule": [chatango.group.moduleInfo.modulePrefix_ + "/UploadMediaModule.js"],
        "MessageStyleEditorModule": [chatango.group.moduleInfo.modulePrefix_ + "/MessageStyleEditorModule.js"],
        "StyleBarModule": [chatango.group.moduleInfo.modulePrefix_ + "/StyleBarModule.js"],
        "TextColorModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/TextColorModule.js"],
        "PmExtrasModule": [chatango.group.moduleInfo.modulePrefix_ + "/PmExtrasModule.js"],
        "ParticipantsModule": [chatango.group.moduleInfo.modulePrefix_ + "/ParticipantsModule.js"],
        "SmileyPickerModule": [chatango.group.moduleInfo.modulePrefix_ + "/SmileyPickerModule.js"],
        "PaymentsModule": [chatango.group.moduleInfo.modulePrefix_ + "/PaymentsModule.js"],
        "ChannelPickerModule": [chatango.group.moduleInfo.modulePrefix_ + "/ChannelPickerModule.js"],
        "SoundDialogModule": [chatango.group.moduleInfo.modulePrefix_ +
        "/SoundDialogModule.js"],
        "AutoModModule": [chatango.group.moduleInfo.modulePrefix_ + "/AutoModModule.js"],
        "ChooseModIconModule": [chatango.group.moduleInfo.modulePrefix_ + "/ChooseModIconModule.js"],
        "WarningDialogModule": [chatango.group.moduleInfo.modulePrefix_ + "/WarningDialogModule.js"]
    };
}
//enable all CHANNELS TAG
function enableUnusedChannels() {
    chatango.group.channels.ChannelController.UNUSED_CHANNELS = {};
}
linkInternalModules();
enableUnusedChannels();
function showTimeInAllMessages() {
    //tinha metodo melhor porém só esse é 100% dos casos
    chatango.output.GroupOutputWindow.prototype.getGroupMessage = function(messageData, opt_position) {
        var showDate = true;
        if (showDate) {
            this.lastDatedMessageTime_ = Math.max(this.lastDatedMessageTime_, Number(messageData.getTimeStamp()));
        }
        if (chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator()) {
            if (!this.moderationModuleLoaded_) {
                if (!this.modMsgsArr_) {
                    this.modMsgsArr_ = [];
                }
                this.modMsgsArr_.push([messageData, opt_position]);
                if (!this.moderationModuleRequested_) {
                    this.dispatchEvent(new goog.events.Event(chatango.events.EventType.REQUEST_MOD_MODULE, this));
                    this.moderationModuleRequested_ = true;
                }
                return null;
            } else {
                return new chatango.group.moderation.GroupModMessage(messageData, this.managers_, showDate);
            }
        } else {
            return new chatango.group.GroupMessage(messageData, this.managers_, showDate);
        }
    };
}
showTimeInAllMessages();