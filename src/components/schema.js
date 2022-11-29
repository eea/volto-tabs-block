import { TABS_BLOCK } from "@eeacms/volto-tabs-block/constants";
import { defineMessages, useIntl } from "react-intl";

export const schema = (config, templateSchema = {}) => {
	const templatesConfig = config.blocks.blocksConfig[TABS_BLOCK].templates;
	const templates = Object.keys(templatesConfig).map((template) => [
		template,
		templatesConfig[template].title || template,
	]);

	const defaultFieldset = templateSchema?.fieldsets?.filter(
		(fieldset) => fieldset.id === "default"
	)[0];
	const intl = useIntl();
	const messages = defineMessages({
		tabsBlock: {
			id: "tabsBlock",
			defaultMessage: "Tabs Block",
		},
		default: {
			id: "default",
			defaultMessage: "Default",
		},
		title: {
			id: "title",
			defaultMessage: "Title",
		},
		tabs: {
			id: "tabs",
			defaultMessage: "Tabs",
		},
		template: {
			id: "template",
			defaultMessage: "Template",
		},
		verticalAlign: {
			id: "verticalAlign",
			defaultMessage: "Vertical Align",
		},
	});

	return {
		title: templateSchema?.title || intl.formatMessage(messages.tabsBlock),
		fieldsets: [
			{
				id: "default",
				title: "Default",
				fields: [
					"data",
					"title",
					"template",
					"verticalAlign",
					...(defaultFieldset?.fields || []),
				],
			},
			...(templateSchema?.fieldsets?.filter(
				(fieldset) => fieldset.id !== "default"
			) || []),
		],
		properties: {
			data: {
				title: intl.formatMessage(messages.tabs),
				type: "tabs",
			},
			title: {
				title: intl.formatMessage(messages.title),
			},
			template: {
				title: intl.formatMessage(messages.template),
				type: "array",
				choices: [...templates],
				default: "default",
			},
			verticalAlign: {
				title: intl.formatMessage(messages.verticalAlign),
				type: "array",
				choices: [
					["flex-start", "Top"],
					["center", "Middle"],
					["flex-end", "Bottom"],
				],
				default: "flex-start",
			},
			...(templateSchema?.properties || {}),
		},
		required: [...(templateSchema?.required || [])],
	};
};
