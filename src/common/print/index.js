import lodopLine from './lodopLine'
import lodopText from './lodopText'
import lodopTable from './lodopTable'
import lodopCode from './lodopCode'

const PRINTER = {
    instance: null,
    setInstance: function (lodop) {
        if (lodop && lodop.VERSION) {
            this.instance = lodop
        }
    },
    init(lodop) {
        this.setInstance(lodop)
        if (!this.instance) {
            throw Error('初始化打印控件失败')
        }
    },
    printInit(taskName = '') {
        this.instance.PRINT_INIT(taskName)
    },
    renderPage(config = {}) {
        const {printType, pageWidth, pageHeight, pageType, copies,multiPages,items} = config
        this.instance.SET_PRINT_PAGESIZE(printType || 1, pageWidth || 1000, pageHeight || 1000, pageType || 'CreateCustomPage')
        this.instance.SET_PRINT_COPIES(copies)
        this.instance.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true); //宽度溢出缩放
        if (multiPages && multiPages.length) {
            multiPages.forEach((page,index) => {
                this.instance.SET_PRINT_MODE('CUSTOM_TASK_NAME',`PAGE${index}`)
                // const baseItemName = `PAGE${index}`
                // this.instance.ADD_PRINT_TEXTA(baseItemName,0,0,1,1,'')
                page.items.forEach(item => {
                    const {type, isBarCode, isQrCode} = item
                    if (isQrCode) {
                        item.codeType = 'QRCode'
                        lodopCode.command(this.instance,item)
                    } else if (isBarCode) {
                        item.codeType = '128Auto'
                        lodopCode.command(this.instance,item)
                    } else if (type === 'text') {
                        lodopText.command(this.instance, item)
                    } else if (type === 'line') {
                        lodopLine.command(this.instance, item)
                    } else if (type === 'table') {
                        lodopTable.command(this.instance, item)
                    }
                })
                this.newPage()
            })
        } else if(items && items.length) {
            items.forEach(item => {
                const {type, isBarCode, isQrCode} = item
                if (isQrCode) {
                    item.codeType = 'QRCode'
                    lodopCode.command(this.instance,item)
                } else if (isBarCode) {
                    item.codeType = '128Auto'
                    lodopCode.command(this.instance,item)
                } else if (type === 'text') {
                    lodopText.command(this.instance, item)
                } else if (type === 'line') {
                    lodopLine.command(this.instance, item)
                } else if (type === 'table') {
                    lodopTable.command(this.instance, item)
                }
            })
        }
    },
    preview() {
        this.instance.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW',1)
        // this.instance.SET_PRINT_MODE('RESELECT_PAGESIZE',1)
        this.instance.PREVIEW()
    },
    print() {
        this.instance.PRINT()
    },
    newPage() {
        this.instance.NEWPAGEA()
    },
    command(lodop, pageConfig, action=0) {
        this.init(lodop)
        this.printInit(pageConfig.templateName)
        this.renderPage(pageConfig)
        if (action === 0) {
            this.preview()
        } else if (action === 1) {
            this.print()
        }
    },
}

export default PRINTER