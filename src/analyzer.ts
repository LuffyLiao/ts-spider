

import fs from 'fs' // node中的核心模块，判断文件是否存在
import cheerio from 'cheerio'
import { Analyzer } from './crowller'

interface Beauties {
    name:string,
    desc:string,
    src:any
}

interface Result {
    time: number,
    data: Beauties[]
}

interface Content{
    [propName:number]: Beauties[]
}

// implements 类实现接口
export default class DoAnalyzer implements Analyzer{
    /**
     * 获取数据中想要的内容
     * @param html 
     */
    private getInfo(html:string){
        const $ = cheerio.load(html)
        const items = $('.posts-default')
        const beauties: Beauties[] = []

        items.map((index,element)=>{
            const name = $(element).find('.posts-default-title h2').eq(0).text()
            const desc = $(element).find('.posts-default-content .posts-text').eq(0).text()
            const src = $(element).find('.posts-default-img .thumbnail').eq(0).attr('src')
            
            beauties.push({ name, desc, src})
        })

        return {
            time: new Date().getTime(),
            data: beauties
        }    
    }

    /**
     * 获取的数据
     */
    generateJsonContent(result: Result, filePath:string){
        let fileContent: Content = {}

        // 如果文件存在,读取内容，放到
        if(fs.existsSync(filePath)){
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
        fileContent[result.time] = result.data
        return fileContent
    }

    public analyze(html:string, filePath:string){
        const info = this.getInfo(html)
        const fileContent = this.generateJsonContent(info, filePath)
        
        return JSON.stringify(fileContent)
    }

    public url = `http://www.meinv.hk/` 
}