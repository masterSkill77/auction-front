import Attribute from './Attribute'
import Checkbox from './attributes/Checkbox'
import SmallText from './attributes/SmallText'
import Category from './attributes/Category'
import Map from './attributes/Map'
import Select from './attributes/Select'
import Fileupload from './attributes/Fileupload'
import Rgpd from './attributes/Rgpd'
import Radio from './attributes/Radio'
import Email from './attributes/Email'
import Textarea from './attributes/Textarea'
import Markdown from './attributes/Markdown'

export default class Form {
  constructor() {
    this.steps = []
  }

  toBackend() {
    let attributesData = []
    for (let i = 0; i < this.steps.length; i++) {
      attributesData.push(this.steps[i].toBackend())
    }
    return {
      steps: attributesData,
    }
  }

  toSurveyJS() {
    let attributesData = []
    for (let i = 0; i < this.steps.length; i++) {
      attributesData.push(this.steps[i].toSurveyJS())
    }

    return {
      pages: attributesData,
    }
  }

  getMatchingAttributeFromDB(field) {
    var attribute
    switch (field.form_attribute_type_id) {
      case Attribute.type.SMALLTEXT:
        attribute = SmallText.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.SMALLTEXT
        break

      case Attribute.type.CHECKBOX:
        attribute = Checkbox.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.CHECKBOX
        break

      case Attribute.type.CATEGORY:
        attribute = Category.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.CATEGORY
        break

      case Attribute.type.LOCATION:
        attribute = Map.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.LOCATION
        break

      case Attribute.type.EMAIL:
        attribute = Email.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.EMAIL
        break

      case Attribute.type.DATE:
        attribute = SmallText.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.DATE
        break

      case Attribute.type.NUMBER:
        attribute = SmallText.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.NUMBER
        break

      case Attribute.type.DATETIME:
        attribute = SmallText.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.DATETIME
        break

      case Attribute.type.TEXTAREA:
        attribute = Textarea.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.TEXTAREA
        break

      case Attribute.type.MARKDOWN:
        attribute = Markdown.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.MARKDOWN
        break

      case Attribute.type.SELECT:
        attribute = Select.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.SELECT
        break

      case Attribute.type.FILEUPLOAD:
        attribute = Fileupload.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.FILEUPLOAD
        break

      case Attribute.type.GDPR:
        attribute = Rgpd.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.GDPR
        break

      case Attribute.type.RADIO:
        attribute = Radio.createInstanceFromDB(field)
        attribute.form_attribute_type_id = Attribute.type.RADIO
        break

      default:
        return null
    }

    return attribute
  }

  getMatchingAttribute(field) {

    var attribute
    switch (field.type) {
      case 'text':
        attribute = SmallText.createInstanceFromSurveyJS(field)

        switch (field.inputType) {
          case 'text':
            attribute.form_attribute_type_id = Attribute.type.SMALLTEXT
            break
          case 'email':
            attribute.form_attribute_type_id = Attribute.type.EMAIL
            break
          case 'date':
            attribute.form_attribute_type_id = Attribute.type.DATE
            break
          case 'number':
            attribute.form_attribute_type_id = Attribute.type.NUMBER
            break
          case 'datetime-local':
            attribute.form_attribute_type_id = Attribute.type.DATETIME
            break
          case 'textarea':
            attribute.form_attribute_type_id = Attribute.type.TEXTAREA
            break
          case 'markdown':
            attribute.form_attribute_type_id = Attribute.type.MARKDOWN
            break
          default:
            attribute.form_attribute_type_id = Attribute.type.SMALLTEXT
            break
        }

        break
      case 'dropdown':
        attribute = Select.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.SELECT
        break
      case 'checkbox':
        attribute = Checkbox.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.CHECKBOX
        break
      case 'map':
        attribute = Map.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.LOCATION
        break
      case 'file':
        attribute = Fileupload.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.FILEUPLOAD
        break

      case 'rgpd':
        attribute = Rgpd.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.GDPR
        break

      case 'category':
        attribute = Category.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.CATEGORY
        break

      case 'radiogroup':
        attribute = Radio.createInstanceFromSurveyJS(field)
        attribute.form_attribute_type_id = Attribute.type.RADIO
        break
    }

    return attribute
  }

  addStep(step) {
    this.steps.push(step)
  }

  addStepAt(step, index) {
    this.steps.splice(index, 0, step)
  }

  removeStep(index) {
    this.steps.splice(index, 1)
  }

  setForm(form) {
    this.form = form
  }

  setIsAnonymous(isAnonymous) {
    this.is_anonymous = isAnonymous
  }
}
