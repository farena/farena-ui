import FormTextPlayground from "./sections/_FormTextPlayground";
import FormNumberPlayground from "./sections/_FormNumberPlayground";
import FormSwitchPlayground from "./sections/_FormSwitchPlayground";
import FormCheckboxPlayground from "./sections/_FormCheckboxPlayground";
import FormBlockPlayground from "./sections/_FormBlockPlayground";
import FormDropdownPlayground from "./sections/_FormDropdownPlayground";
import FormComboboxPlayground from "./sections/_FormComboboxPlayground";
import CalendarPlayground from "./sections/_CalendarPlayground";
import FormButtonPlayground from "./sections/_FormButtonPlayground";
import FormSelectPlayground from "./sections/_FormSelectPlayground";
import FormBooleanPlayground from "./sections/_FormBooleanPlayground";
import FormLinkPlayground from "./sections/_FormLinkPlayground";
import FormTimePlayground from "./sections/_FormTimePlayground";
import FormWeeklyDatePlayground from "./sections/_FormWeeklyDatePlayground";
import FormDatePlayground from "./sections/_FormDatePlayground";
import FormDateRangePlayground from "./sections/_FormDateRangePlayground";
import ToastPlayground from "./sections/_ToastPlayground";
import FormUploaderPlayground from "./sections/_FormUploaderPlayground";
import FormCommentPlayground from "./sections/_FormCommentPlayground";
import FormCodePlayground from "./sections/_FormCodePlayground";
import FormImageCropperPlayground from "./sections/_FormImageCropperPlayground";
import FormColorpickerPlayground from "./sections/_FormColorpickerPlayground";
import TabsPlayground from "./sections/_TabsPlayground";
import FormHtmlPlayground from "./sections/_FormHtmlPlayground";
import AccordionPlayground from "./sections/_AccordionPlayground";
import InfiniteScrollPlayground from "./sections/_InfiniteScrollPlayground";
import SimplePagerPlayground from "./sections/_SimplePagerPlayground";
import WidgetPlayground from "./sections/_WidgetPlayground";
import ChartsPlayground from "./sections/_ChartsPlayground";

export default function App() {
  return (
    <>
      <div className="container py-4">
        <h2 className="mb-1">UI Playground</h2>
        <p className="text-muted mb-4">
          Sandbox to test every <code>@farena/farena-ui</code> component.
        </p>

        <FormTextPlayground />
        <FormNumberPlayground />
        <FormSwitchPlayground />
        <FormCheckboxPlayground />
        <FormBlockPlayground />
        <FormDropdownPlayground />
        <FormComboboxPlayground />
        <CalendarPlayground />
        <FormButtonPlayground />
        <FormSelectPlayground />
        <FormBooleanPlayground />
        <FormLinkPlayground />
        <FormTimePlayground />
        <FormWeeklyDatePlayground />
        <FormDatePlayground />
        <FormDateRangePlayground />
        <ToastPlayground />
        <FormUploaderPlayground />
        <FormCommentPlayground />
        <FormCodePlayground />
        <FormImageCropperPlayground />
        <FormColorpickerPlayground />
        <TabsPlayground />
        <FormHtmlPlayground />
        <AccordionPlayground />
        <InfiniteScrollPlayground />
        <SimplePagerPlayground />
        <WidgetPlayground />
        <ChartsPlayground />
      </div>
    </>
  );
}
