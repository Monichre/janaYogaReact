var fs = require('fs')
var async = require('async')
var mkdirp = require('mkdirp')
var Handlebars = require('handlebars')


module.exports = (args, done) => {
	const CONTENT = args.content
    var locals = {}

    async.series([
        // Register partials
        callback => {
            fs.readFile(__dirname + '/layouts/partials/menu.html', 'utf8', (err, data) => {
                if (err) {
                    return console.log(err)
                }
                Handlebars.registerPartial('menu', data)
                callback()
            })
        },
        callback => {
            fs.readFile(__dirname + '/layouts/index.html', 'utf8', (err, data) => {
                if (err) {
                    return console.log(err)
                }
                var template = Handlebars.compile(data)
                locals.template = template
                callback()
            })
        },
        () => {
            var markup = locals.template({CONTENT})
			fs.writeFile(__dirname + '/build-new/index.html', markup, err => {
				if (err) {
					return console.log(err)
				}
				console.log(markup)
				done()
			})
        }
    ])
}
