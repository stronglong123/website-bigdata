import fileUploader from 'components/files/fileUploader'
import {mapState,mapMutations,mapGetters} from 'vuex'
import printer from 'common/print/index'
import moment from 'moment'

const mixins = {
    data() {
        return {
            loadingInstance: null,
            LODOP:null,
            lodopDownloadUrl:'http://yjp-dev-supplychain.ufile.ucloud.com.cn/CLodop_Setup_for_Win32NT.zip',
            overFlow:false,
            btnPermissions:[]
        }
    },
    components: {
        fileUploader
    },
    created() {
        if (this.$store) {
            const permission = this.getPermission(this.userInfo.userId,this.chooseRoleInfoList.warehouseId || this.chooseRoleInfoList.orgId,this.$route.name)
            this.btnPermissions = permission ? permission.actionPermission : []
        }
    },
    mounted() {
        let windowWidth = document.documentElement.clientWidth
        parseInt(windowWidth)<1280 ? this.overFlow = true : this.overFlow = false
    },
    computed:{
        ...mapState('user',['chooseRoleInfoList','choosenRole','choosenOrg','userInfo','token','serviceId']),
        ...mapState('globalSettings',['envNo']),
        ...mapGetters('userPermission',['getPermission'])
    },
    methods: {
        ...mapMutations('globalSettings',['disableLoading','enableLoading']),
        uploadFile(data) {
            if (data !== 'error') {
                this.$message('导入成功')
            }
        },
        getExcelProcessor() {
            return import("vendor/Export2Excel")
        },
        getUserContext() {
            const context = {}
            context.userId = this.userInfo.userId
            context.userName = this.userInfo.trueName
            context.cityId = this.chooseRoleInfoList.orgId
            context.orgName = this.chooseRoleInfoList.orgName
            context.orgType = this.chooseRoleInfoList.orgType
            context.warehouseId = this.chooseRoleInfoList.warehouseId
            context.roleCodes = this.chooseRoleInfoList.roleCodes
            context.serviceId = this.serviceId
            context.envNo = this.envNo
            return context;
        },
        printReady() {
            console.log("打印服务已准备好")
            this.LODOP = window.getCLodop();
        },
        printFail() {
            console.log("打印服务加载失败")
        },
        checkLodop() {
            if (!this.LODOP) {
                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: `<span>未检测到可用的打印服务，请点击<a href="${this.lodopDownloadUrl}" target="_blank">下载链接</a>安装打印控件后再刷新浏览器</span>`,
                    type: 'warning',
                    duration: 0
                });
                return false
            }
            return true
        },
        buildMultiPrinter(template={},pages=[],callback,mode) {
            const config = {}
            if(mode){
                config.mode = Number(mode)
            }
            config.templateName = template.name
            config.printType = 1 //纵向打印
            config.pageWidth = template.globalConfig.widthValue + (template.globalConfig.widthUnit === 'mm' ? 'mm' : template.globalConfig.widthUnit)
            config.pageHeight = template.globalConfig.height + 'mm'
            config.copies = template.globalConfig.copies || 1
            config.multiPages = pages.map(page => {
                const items = template.items.map(item => {
                    const prop = {...item.prop}
                    if (!item.prop.isBarCode && !item.prop.isQrCode) {
                        const htmlStr = this.getTemplateHtml(item,page.detail,page.items)
                        htmlStr && (prop.htmlTxt = htmlStr)
                    } else {
                        prop.value = page['detail'][item.prop.fieldName] || ''
                    }
                    return prop
                })
                return {items}
            })
            this.printPage(config,callback)
        },
        buildPrinter(template={},detail={},items=[],mode=0, callback) {
            const config = {mode}
            config.templateName = template.name
            config.printType = 1 //纵向打印
            config.pageWidth = template.globalConfig.widthValue + (template.globalConfig.widthUnit === 'mm' ? 'mm' : template.globalConfig.widthUnit)
            config.pageHeight = template.globalConfig.height + 'mm'
            config.copies = template.globalConfig.copies || 1
            config.items = template.items.map(item => {
                const prop = {...item.prop}
                if (!item.prop.isBarCode && !item.prop.isQrCode) {
                    const htmlStr = this.getTemplateHtml(item,detail,items)
                    htmlStr && (prop.htmlTxt = htmlStr)
                } else {
                    prop.value = detail[item.prop.fieldName] || ''
                }
                return prop
            })
            this.printPage(config,callback)
        },
        printPage(config, callback) {
            if (this.LODOP) {
                this.LODOP.On_Return = (taskId,value) =>{
                    if (value) {
                        this.$message('已发起打印，请查看打印机输出')
                        if (callback && callback.call) {
                            callback()
                        }
                    } else {
                        this.$message.info('打印失败，请检查打印机是否可用')
                    }
                }
                printer.command(this.LODOP, config, config.mode)
            }
        },
        getTemplateHtml(item={},mainData={},subData=[]) {
            let itemHtml = ''
            if (item.type === 'dynamic-field') {
                itemHtml = `<div id="${item.id}" style="${this.transObjStyle(item.prop.style)}">${item.prop.text ? item.prop.text + ":" :'' }${mainData[item.prop.fieldName] || ''}</div>`
            }
            if (item.type === 'print-field') {
                if (item.prop.printType === 1) {
                    //打印时间
                    item.prop.value = moment().format('YYYY-MM-DD HH:mm:ss')
                } else if (item.prop.printType === 2){
                    //打印人
                    item.prop.value = this.getUserContext().userName
                } else if (item.prop.printType === 3) {
                    item.prop.value = 1
                }
                itemHtml = `<div id="${item.id}" style="${this.transObjStyle(item.prop.style)}">${item.prop.text}：${item.prop.value}</div>`
            }
            if (item.type === 'text-field') {
                itemHtml = `<div id="${item.id}" style="${this.transObjStyle(item.prop.style)}">${item.prop.text}</div>`
            }

            if (item.type === 'text-area') {
                itemHtml = `<div id="${item.id}" style="${this.transObjStyle(item.prop.style)}">${item.prop.text.replace(/[\n\r]/g, '<br>').replace(/[ ]/g, '&nbsp;')}</div>`
            }
            if (item.type === 'data-table') {
                const {borderCollapse, borderWidth, borderStyle, borderColor, fontFamily, fontSize,} = item.prop.style
                itemHtml =`<style>table {${this.transObjStyle(item.prop.style)}} table th,td {${this.transObjStyle({borderCollapse, borderWidth, borderStyle, borderColor, fontFamily, fontSize,})}}</style>`
                itemHtml += `<table id="${item.id}" border="1" >`
                const children = item.prop.children
                if (children.length) {

                    itemHtml += `<thead><tr>`
                    children.forEach(col => {
                        itemHtml += `<th width="${col.width}">${col.name}</th>`
                    })
                    itemHtml += `</tr></thead>`
                    itemHtml += `<tbody>`
                    subData.forEach((data,index) => {
                        itemHtml += `<tr>`
                        children.forEach(col => {
                            if (col.fieldName === '$index') {
                                itemHtml += `<td >${index + 1}</td>`
                            } else if (col.fieldName.indexOf('$text') !== -1) {
                                itemHtml += `<td ></td>`
                            } else if (col.fieldName.indexOf('::') !== -1) {
                                const realCols = col.fieldName.split('::')
                                const tdData = realCols.map(it => data[it]==='undefined'?'':data[it]).join('')
                                itemHtml += `<td >${tdData}</td>`
                            } else {
                                itemHtml += `<td >${data[col.fieldName] || ''}</td>`
                            }

                        })
                        itemHtml += `</tr>`
                    })
                    //有合计行时，生成合计行数据
                    if (children.some(col => col.amount)) {
                        itemHtml += `<tr>`
                        children.forEach(col => {
                            itemHtml += `<td  ${col.amount ? 'tdata="AllSum" format="#.##">######</td>' : '></td>'}`
                        })
                        itemHtml += `</tr>`
                    }
                    itemHtml += `</tbody>`
                }
                const footer = item.prop.footer
                if (footer && footer.length) {
                    itemHtml += '<tfoot>'
                    footer.forEach((it, index) => {
                        if (index === 0 && it.newRow) {
                            itemHtml += "<tr>"
                        }
                        if (index !== 0 && it.newRow) {
                            itemHtml += "</tr><tr>"
                        }
                        itemHtml += `<td colspan="${it.colspan}" rowspan="${it.rowspan}" >${it.label}`
                        if (it.tdata) {
                            itemHtml += `<span tdata="${it.tdata}" format="${it.format}" tindex="${it.tindex}">######</span>`
                        }
                        itemHtml += "</td>"
                        if (index === footer.length - 1) {
                            itemHtml += "</tr>"
                        }
                    })
                    itemHtml += '</tfoot>'
                }
                itemHtml += `</table>`
            }
            return itemHtml
        },
        transObjStyle(style) {
            const keys = Object.keys(style)
            let innerStyle = ''
            keys.forEach(propName => {
                innerStyle += `${this.transCamelToLine(propName)}:${style[propName]};`
            })
            return innerStyle
        },
        transCamelToLine(str) {
            return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
        },

    }
}

export default mixins