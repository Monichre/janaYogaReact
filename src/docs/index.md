var fs = require('fs')
var async = require('async')
var mkdirp = require('mkdirp')
var Handlebars = require('handlebars')


module.exports = (args, done) => {
	var yogaClassesSection = args.allTypes[0]
	var retreatsSection = args.allTypes[1]
	var appointmentsSection = args.allTypes[2]

		console.log(yogaClassesSection)
		console.log(retreatsSection)
		console.log(appointmentsSection)

    var cosmic = args.CosmicBucket
    var locals = {}

    async.series([
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
            fs.readFile(__dirname + '/layouts/page.html', 'utf8', (err, data) => {
                if (err) {
                    return console.log(err)
                }
                var template = Handlebars.compile(data)
                locals.template = template
                callback()
            })
        },
        () => {
            var markup = locals.template({
                yogaClassesSection,
                retreatsSection,
                appointmentsSection
            })
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
