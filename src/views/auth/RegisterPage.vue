<template>
  <div
    class="login-page register-page-wrap d-flex align-items-center flex-wrap justify-content-center"
  >
    <div id="surveyCreator" />
    <!--<div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6 col-lg-6">
          <img src="vendors/images/register-page-img.png" alt="" />
        </div>
        <div class="col-md-6 col-lg-6">
          <div class="register-box-5 p-2 bg-white box-shadow border-radius-10">
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import "survey-creator-core/survey-creator-core.i18n";
import { SurveyCreator } from "survey-creator-knockout";
import "survey-core/survey.i18n";

import { surveyLocalization } from "survey-core";
surveyLocalization.supportedLocales = ["en", "fr"];

import { localization } from "survey-creator-core";
localization.currentLocale = "en";
// ...

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
};

export default {
  name: "survey-creator",
  mounted() {
    const creator = new SurveyCreator(creatorOptions);
    creator.text = window.localStorage.getItem("survey-json");
    creator.saveSurveyFunc = (saveNo, callback) => {
      // If you use localStorage:
      window.localStorage.setItem("survey-json", creator.text);
      callback(saveNo, true);

      // If you use a web service:
      // saveSurveyJson(
      //     "https://your-web-service.com/",
      //     creator.JSON,
      //     saveNo,
      //     callback
      // );
    };
    creator.render("surveyCreator");
  },
};
</script>
<style scoped>
:root {
  --wizard-stepper--active: rgba(29, 27, 8, 0.479);
  --wizard-line-color: black;
}

#surveyCreator {
  height: 100vh;
  width: 100vw;
}
</style>
