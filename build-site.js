const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const sass = require('metalsmith-sass');
const contentful = require('contentful')
const async = require('async');
const mkdirp = require('mkdirp');
const del = require('del');
const mv = require('mv');
const createPage = require('./create-page.js');

module.exports = () => {
    async.series([
        // Create build-new folder
        callback => {
            mkdirp(__dirname + '/build-new', err => {
                callback()
            })
        },
        callback => {
            const cms_client = contentful.createClient({
                space: 'ekwq88j88qpz',
                accessToken: '1405d2901c9e548f1d504f1c0b7729c08e54a72f5bd73a63b2dc1f1816a7d2ac'
            })
            cms_client.getEntries()
                .then((response) => {
                    
                    let response_items = response.items
                    let yogaClasses = response_items.filter(item => item.sys.contentType.sys.id === 'yogaClass')
                    console.log(yogaClasses)
                    const CONTENT = {
                        yogaClasses: yogaClasses
                        
                    }
                    async.eachSeries(CONTENT, (type, callbackEach) => {
                        var args = {
                            content: CONTENT
                        }
                        createPage(args, callbackEach)
                    }, () => {
    
    
                        Metalsmith(__dirname)
                            .source('./src')
                            .destination('./build-new')
                            .clean(false)
                            .use(sass({
                                outputDir: 'css/',
                                sourceMap: true,
                                sourceMapContents: true
                            }))
                            .use(markdown())
                            .use(permalinks())
                            .use(layouts({
                                engine: 'handlebars'
                            }))
                            .build((err, files) => {
                                if (err) {
                                    throw err
                                }
                                callback()
                            })
                    })
                })
            },
        // Delete build folder
        callback => {
            del([__dirname + '/build']).then(() => {
                callback()
            })
        },
        // Move build-new to build folder
        callback => {
            mv(__dirname + '/build-new', __dirname + '/build', {
                mkdirp: true
            }, () => {
                callback()
            })
        },
        // Delete build-new folder
        callback => {
            del([__dirname + '/build-new']).then(() => {
                // done
            })
        }
    ])
}
