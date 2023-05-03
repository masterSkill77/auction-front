import Attribute from '../Attribute'

export default class Map extends Attribute {
    constructor(attribute) {
        super(attribute)
    }

    static createInstanceFromDB(attribute) {
        let instance = new Attribute()
        instance.id = attribute.id
        instance.title = {}
        instance.description = {}
        instance.instruction = {}
        instance.help = {}
        instance.name = ''
        instance.requiredPublic = false
        instance.requiredBackoffice = false

        for (let i = 0; i < instance.langs.length; i++) {
            let lang = instance.langs[i]

            let key = lang
            if (lang === instance.defaultLang) {
                key = 'default'
            }

            let stepTranslation = attribute.translations.find(
                (translation) => translation.locale === lang
            )
            instance['title'][key] = stepTranslation.label
            instance['description'][key] = stepTranslation.description
            instance['instruction'][key] = stepTranslation.instruction
            instance['help'][key] = stepTranslation.help
        }
        instance.latitude = attribute.config.map.config.center[0]
        instance.country = attribute.config.map.config.restriction
            ? attribute.config.map.config.restriction.country
            : null
        instance.city = attribute.config.map.config.restriction
            ? attribute.config.map.config.restriction.city
            : null

        instance.longitude = attribute.config.map.config.center[1]
        instance.zoom = attribute.config.map.config.zoom
        instance.provider =
            attribute.config.map.config.type.charAt(0).toUpperCase() +
            attribute.config.map.config.type.slice(1)
        instance['hidden'] = attribute.hidden === 1 ? true : false
        instance['private'] = attribute.response_private === 1 ? true : false
        instance['requiredBackoffice'] =
            attribute.requiredBackoffice == 1 ? true : false
        instance['requiredPublic'] =
            attribute.requiredPublic == 1 ? true : false

        return instance
    }

    toSurveyJS() {
        return {
            id: this.id ?? null,
            type: Attribute.surveyType[this.form_attribute_type_id],
            name: this.name,
            title: this.title,
            description: this.description,
            instruction: this.instruction,
            help: this.help,
            choices: this.choices ?? null,
            latitude: this.latitude ?? null,
            longitude: this.longitude ?? null,
            zoom: this.zoom ?? null,
            provider: this.provider ?? null,
            country: this.country ?? null,
            city: this.city ?? null,
            requiredPublic: this.requiredPublic ?? null,
            requiredBackoffice: this.requiredBackoffice ?? null
        }
    }
}
