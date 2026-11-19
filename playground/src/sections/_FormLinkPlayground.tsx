import { FormLink } from "@farena/farena-ui";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormLinkPlayground() {
  return (
    <Section title="FormLink">
      <Example title="Basic">
        <FormLink label="Related page" to="#formtext">
          Go to FormText
        </FormLink>
      </Example>
      <Example title="With icon">
        <FormLink label="Customer" icon="fa-solid fa-user" to="#formselect">
          John Doe
        </FormLink>
      </Example>
      <Example title="Flex field">
        <FormLink label="Owner" flexField icon="fa-solid fa-user" to="#formcombobox">
          Jane Doe
        </FormLink>
      </Example>
      <Example title="Disabled">
        <FormLink label="Disabled" disabled to="#formtext">
          Not clickable
        </FormLink>
      </Example>
    </Section>
  );
}
