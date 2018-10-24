import resource from '../config/resource'
let urlHeader = 'interactive';

export const getUserInfo = params => resource(urlHeader + '/home/getUserInfo', params);

export const getProposalTypes = params => resource(urlHeader + '/proposal/getProposalTypes', params);

export const collectProposal = params => resource(urlHeader + '/proposal/collect', params, "POST");

export const sendMsg = (mobile,timestamp) => resource(urlHeader + '/message/sendMsg', {
    mobile: mobile,
    timestamp: timestamp
},"POST");

export const getProposalList = params => resource(urlHeader + '/proposal/getProposalList', params);