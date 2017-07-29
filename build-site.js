var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var sass = require('metalsmith-sass');
var Cosmic = require('cosmicjs');
var async = require('async');
var mkdirp = require('mkdirp');
var del = require('del');
var mv = require('mv');
var createPage = require('./create-page.js');



const config = {
  bucket: {
  	slug: 'janamalloyyoga',
  	read_key: 'uvt9q9H4PsGj9XFV1I9NTrIbTgWvfXcHPeHXg8GD9G5ze47q4h',
  	write_key: 'ZkwB10pcZIRqlqzpTXTXEBp4FXNKg6fWj2wQf1czNn6u4xW2Nj'
  }
}

module.exports = () => {
    async.series([
        // Create build-new folder
        callback => {
            mkdirp(__dirname + '/build-new', err => {
                callback()
            })
        },
        callback => {
            Cosmic.getBucket(config, (err, res) => {
                const objects = res.bucket.objects
				const yogaPosts =[]
				const retreatPosts =[]
				const appointments =[]
				objects.forEach((object) => {
					if(object.type_slug === 'yoga-classes'){
						yogaPosts.push(object)
					} else if (object.type_slug === 'retreats'){
						retreatPosts.push(object)
					}else if (object.type_slug === 'appointments'){
						appointments.push(object)
					}else {}
				})
				const CONTENT = {
					yogaPosts: yogaPosts,
					retreatPosts: retreatPosts,
					appointments: appointments
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
