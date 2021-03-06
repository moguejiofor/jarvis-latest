let GraphUtil = require("../utils/graph");
let graphUtil = new GraphUtil();
let _ = require("lodash");
let Moniker = require("moniker");
let projectSettingsManager = require("../utils/settings-manager");
// let projectSettingsManager = new ProjectSettingsManager();

class SettingsController {
    constructor() {}

    async setRootPath(rootPath) {
        let path = projectSettingsManager.setRootPath(rootPath);
        return path;
    }

    async getRootPath() {
        let path = projectSettingsManager.getRootPath();
        return path;
    }

    async setFilterStatus(filterType, filterStatus) {
        let newFilterStatus = projectSettingsManager.setFilterStatus(
            filterType,
            filterStatus
        );
        return newFilterStatus;
    }

    async getFilterStatus(filterType) {
        let filterStatus = projectSettingsManager.getFilterStatus(filterType);
        return filterStatus;
    }

    async setRepoCredentials(credentials) {
        let creds = await projectSettingsManager.setRepoCredentials(
            credentials
        );
        return creds;
    }

    async getRepoCredentials(credentials) {
        let creds = await projectSettingsManager.getRepoCredentials(
            credentials
        );
        return creds;
    }

    async setAggregationHoursValue(value) {
        let hoursValue = await projectSettingsManager.setAggregationHoursValue(
            value
        );
        return hoursValue;
    }

    async getAggregationHoursValue() {
        let hoursValue = await projectSettingsManager.getAggregationHoursValue();
        return hoursValue;
    }

    async setActivityManagerCredentials(credentials) {
        let hoursValue = await projectSettingsManager.setActivityManagerCredentials(
            credentials
        );
        return hoursValue;
    }

    async getActivityManagerCredentials(credentials) {
        let creds = await projectSettingsManager.getActivityManagerCredentials(
            credentials
        );
        return creds;
    }

    async addExpression(expression, filterType, user) {
        let expressionNode = await graphUtil.saveRegex(expression);
        let userNode = await graphUtil.getUserNodeByUsername(user.username);
        let relationship = await graphUtil.relateNodes(
            userNode,
            expressionNode,
            filterType
        );
        return relationship;
    }

    async listFilterExpression(filterType, user) {
        let userNode = await graphUtil.getUserNodeByUsername(user.username);
        let expressions = await graphUtil.getRelatedNodes(userNode, filterType);
        return expressions;
    }

    async deleteFilterExpression(filterId, filterType, user) {
        let userNode = await graphUtil.getUserNodeByUsername(user.username);
        let deleted = await graphUtil.deleteRelationship(
            userNode,
            { id: filterId },
            filterType
        );
        let expressions = await graphUtil.getRelatedNodes(userNode, filterType);
        return expressions;
    }
}

module.exports = new SettingsController();
