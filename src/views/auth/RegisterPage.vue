<template>
	<div
		class="login-page register-page-wrap d-flex align-items-center flex-wrap justify-content-center">
		<div class="container-fluid">
			<div class="row align-items-center">
				<div v-if="!updateProfile" class="col-md-6 col-lg-6">
					<img src="/vendors/images/register-page-img.png" alt="" />
				</div>
				<div
					:class="!updateProfile ? 'col-md-6 col-lg-6' : 'col-md-12 col-lg-12'">
					<div class="register-box-5 p-2 bg-white box-shadow border-radius-10">
						<div id="survey" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import 'survey-core/modern.min.css';

	import 'survey-creator-core/survey-creator-core.i18n';
	// import { SurveyCreator } from "survey-creator-knockout";
	import 'survey-core/survey.i18n';
	import { Survey } from 'survey-knockout-ui';
	import axios from '@/src/axios';
	import { surveyLocalization, StylesManager } from 'survey-core';
	StylesManager.applyTheme('modern');
	surveyLocalization.supportedLocales = ['en', 'fr'];
	localStorage.getItem('auction-local') ?? import.meta.env.VITE_DEFAULT_LOCALE;
	import { useAuthStore } from '../../stores/auth';
	import { storeToRefs } from 'pinia';
	import { useI18nStore } from '../../stores/i18n';
	import { useLoadingStore } from '../../stores/loading';
	// import { localization } from "survey-creator-core";
	// localization.currentLocale = "fr";
	// ...

	const creatorOptions = {
		showLogicTab: true,
		isAutoSave: true,
		showTranslationTab: true,
	};

	export default {
		name: 'survey-creator',
		props: ['updateProfile'],
		data() {
			return {
				langue: null,
				survey: null,
			};
		},
		methods: {
			async onComplete(sender) {
				await useAuthStore().register(sender.data);
			},
		},
		watch: {
			langue(newLangue) {
				this.survey.locale = newLangue;
			},
		},
		async mounted() {
			const self = this;
			useLoadingStore().setLoading(true);
			setTimeout(() => {
				useLoadingStore().setLoading(false);
			}, 2000);
			const { isAuthenticated } = storeToRefs(useAuthStore());
			const { currentLocale } = storeToRefs(useI18nStore());
			if (isAuthenticated.value && this.updateProfile == undefined)
				return this.$router.push('/');
			const surveyJSON = await axios
				.get('/form/1')
				.then(({ data }) => data.form_content);

			this.survey = new Survey(surveyJSON);
			this.survey.locale = currentLocale.value;
			this.langue = currentLocale;

			if (this.updateProfile) {
				const { me } = storeToRefs(useAuthStore());

				this.survey.onComplete.add((sender) => {
					self.$emit('updateProfile', sender.data, me.value.id);
				});
				this.survey.mergeData({
					name: me.value.name,
					lastname: me.value.lastname,
					email: me.value.email,
					username: me.value.username,
					profile_image: JSON.parse(me.value.configuration.profile_image)[0],
					card_number: me.value.configuration.card_number,
					cvc: me.value.configuration.cvc,
					card_expires:
						me.value.configuration.card_expires_year +
						'-' +
						me.value.configuration.card_expires_month,
					etherum_adress: me.value.etherum_adress,
				});
			} else {
				this.survey.onComplete.add(this.onComplete);
			}
			this.survey.onCurrentPageChanging.add(async (sender, options) => {
				var page = sender.currentPage;
				var questionEmail = null;
				var questionUsername = null;
				if (!self.updateProfile) {
					questionEmail = page.getQuestionByName('email');
					questionUsername = page.getQuestionByName('username');
				}

				if (questionEmail) {
					const exists = await useAuthStore().emailOrUsernamExists(
						sender.data['email']
					);
					if (exists == 1) {
						sender.currentPage = page;
						options.allowChanging = false;
						options.allow = false;
						questionEmail.addError(this.$t('error.inputs.email_existe'));
					} else {
						questionEmail.clearErrors();
						options.allow = true;
						options.allowChanging = true;
					}
				}
				if (questionUsername) {
					const exists = await useAuthStore().emailOrUsernamExists(
						sender.data['username']
					);
					if (exists == 1) {
						sender.currentPage = page;
						options.allowChanging = false;
						options.allow = false;
						questionUsername.addError(this.$t('error.inputs.username_existe'));
					} else {
						questionUsername.clearErrors();
						options.allow = true;
						options.allowChanging = true;
					}
				}
			});

			this.survey.render('survey');
			// const creator = new SurveyCreator(creatorOptions);
			// creator.text = window.localStorage.getItem("survey-json");
			// creator.saveSurveyFunc = (saveNo, callback) => {
			//   // If you use localStorage:
			//   window.localStorage.setItem("survey-json", creator.text);
			//   callback(saveNo, true);
			//   // If you use a web service:
			//   // saveSurveyJson(
			//   //     "https://your-web-service.com/",
			//   //     creator.JSON,
			//   //     saveNo,
			//   //     callback
			//   // );
			// };
			// creator.render("surveyCreator");
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
