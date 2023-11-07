const fs = require('fs/promises')
const csvFilePath = './data/districts.csv'
const csv = require("csvtojson/v2");
const { geojson: [geojson] } = require('../../data/districts.geo.json')

const dateSuffix = new Intl.DateTimeFormat('de', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}).format(Date.now()).toLowerCase().trim().replace(/([a-z:./\s,])+/g, '-');

(async () => {
    const importedCSV = await csv().fromFile(csvFilePath)
    
    geojson.features.forEach(feature => {
        feature.properties.data = {}
        importedCSV.forEach(row => {
            feature.properties.data[row._prop_key] = {}
            feature.properties.data[row._prop_key].meta = {}
            
            Object.keys(row).forEach(key => {
                if (key === feature.properties.Name) {
                    feature.properties.data[row._prop_key]['name'] = row['_display_name']
                    feature.properties.data[row._prop_key]['value'] = row[key]
                }
                if (key.startsWith('_') && key !== '_display_name') {
                    feature.properties.data[row._prop_key]['meta'][key] = row[key]
                }
            })
        })
    })

    try {
        await fs.writeFile(`./data/merged/districts-${dateSuffix}.geo.json`, JSON.stringify(geojson))
        console.log(`Successfully merged data into districts-${dateSuffix}.geo.json!`);
    } catch (error) {
        console.log('Error: ', error);
    }
})()