import Attribute from '../Attribute'

export default class Checkbox extends Attribute {
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
        instance.choices = []
        instance.requiredPublic = false
        instance.requiredBackoffice = false

        let defaultLang = instance.defaultLang

        if (Object.keys(attribute.config.options).length === 1) {
            if (defaultLang != Object.keys(attribute.config.options)[0]) {
                attribute.config.options[
                    Object.keys(attribute.config.options)[0]
                ].forEach((value) => {
                    instance['choices'].push({
                        text: {
                            [Object.keys(attribute.config.options)[0]]: value
                        }
                    })
                })
            } else {
                attribute.config.options[
                    Object.keys(attribute.config.options)[0]
                ].forEach((value) => {
                    instance['choices'].push({
                        text: value
                    })
                })
            }
        } else if (Object.keys(attribute.config.options).length > 1) {
            attribute.config.options[defaultLang].forEach((value) => {
                instance['choices'].push({
                    text: {}
                })
            })

            for (let i = 0; i < instance.langs.length; i++) {
                let lang = instance.langs[i]
                let key = lang

                if (lang === instance.defaultLang) {
                    key = 'default'
                }

                for (
                    let j = 0;
                    j < attribute.config.options[lang].length;
                    j++
                ) {
                    instance['choices'][j].text[key] =
                        attribute.config.options[lang][j]
                }
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
            instruction: this.instruction,
            help: this.help,
            title: this.title,
            description: this.description,
            choices: this.choices,
            requiredPublic: this.requiredPublic ?? null,
            requiredBackoffice: this.requiredBackoffice ?? null
        }
    }
}
