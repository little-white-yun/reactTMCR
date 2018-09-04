
const baseUrl = 'http://120.132.102.69:8080/';
const baseName = "/TmTool";
const token = sessionStorage.getItem("token");
const URL = {
    filePath: window.location.origin + baseName + "/upload",
    // 登录
    // login: Url + baseName + "/setting/query.do",
    login: baseUrl + baseName + "/dictionary/queryPage.do",

    // 获取发起收到请求列表
    cmcsList: baseUrl + baseName + "/adviser/cmcsList.do?token="+token,

    // MC或者MR发起一个请求
    insertCmcs: baseUrl + baseName + "/adviser/insertCmcs.do",

    //查询医生信息，顺带对应的MC或者MR信息
    getTargetCustList: baseUrl + baseName + "/adviser/getTargetCustList.do",

    // 查询一个请求流程的所有信息
    getCmcs: baseUrl + baseName + "/adviser/getCmcs.do",

    // MC或者MR发起一个请求
    insertCmcs: baseUrl + baseName + "/adviser/insertCmcs.do",

    // MC或者MR修改请求状态，或者填写反馈
    updateCmcs: baseUrl + baseName + "/adviser/updateCmcs.do",

    // 获取所有的请求导出为excel
    getReport: baseUrl + baseName + "/adviser/getReport.do",

    // MC或者MR修改请求状态，或者填写反馈
    getCrType: baseUrl + baseName + "/adviser/getCrType.do",

    // 上传MC关系
    uploadMcMapping: baseUrl + baseName + "/adviser/uploadMcMapping.do",

    // 下载MC关系
    getMcMappingDemo: baseUrl + baseName + "/adviser/getMcMappingDemo.do",

    // 满意与不满意
    eval: baseUrl + baseName + "/adviser/eval.do",
    // /adviser/eval.do


    // 话术关系列表
    getScList: baseUrl + baseName + "/adviser/getScList.do",

    // 上传话术关系
    oprSc: baseUrl + baseName + "/adviser/oprSc.do",

    // 获取医院列表
    getHospital: baseUrl + baseName + "/adviser/getHospital.do",

    // 客户状态级联数据
    getCascadeChoose: baseUrl + baseName + "/adviser/getCascadeChoose.do",

    // 查询医生状态列表
    getCustomerState: baseUrl + baseName + "/adviser/getCustomerState.do",

    // 导出医生状态报表
    exportCustomerState: baseUrl + baseName + "/adviser/exportCustomerState.do",

}


export { baseUrl, baseName, URL};