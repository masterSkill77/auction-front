import Attribute from '../Attribute'

export default class Fileupload extends Attribute {
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
        instance.acceptedTypes = ''
        instance.maximum = attribute.config.max
        instance.minimum = attribute.config.min
        instance.filetype =
            attribute.config.type.charAt(0).toUpperCase() +
            attribute.config.type.slice(1)
        instance.requiredPublic = false
        instance.requiredBackoffice = false

        if (attribute.config['accepted-ext']) {
            for (let j = 0; j < attribute.config['accepted-ext'].length; j++) {
                instance.acceptedTypes +=
                    attribute.config['accepted-ext'][j] + ' '
            }
        }
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
            acceptedTypes: this.acceptedTypes ?? null,
            maximum: this.maximum ?? null,
            filetype: this.filetype ?? null,
            minimum: this.minimum,
            requiredPublic: this.requiredPublic ?? null,
            requiredBackoffice: this.requiredBackoffice ?? null
        }
    }
}
