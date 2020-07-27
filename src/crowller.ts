import fs from 'fs'
import path from 'path' 

import superagent from 'superagent'

import DoAnalyzer from './analyzer'

export interface Analyzer {
    analyze: (html:string, filePath:string) => string,
    url: string
}
class Crowller {
    private filePath = path.resolve(__dirname, '../data/beauties.json')

    /**
     * 获取html内容 
     * async ：ES7中的异步函数
     */
    async getRawHtml(url: string){
        const result = await superagent.get(url)
        return result.text   
    }

    
    writeFile(content: string){
        fs.writeFileSync(this.filePath, content)
    }

    async init(){
        const url = this.analyzer.url
        const html = await this.getRawHtml(url)
        const fileContent = this.analyzer.analyze(html, this.filePath)

        this.writeFile(fileContent)      
    }

    constructor(private analyzer:Analyzer){
        this.init()
    }
}

const analyzer = new DoAnalyzer()
const crowller = new Crowller(analyzer)