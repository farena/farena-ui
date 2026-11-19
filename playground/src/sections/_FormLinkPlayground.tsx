import { FormLink } from "@farena/farena-ui";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormLinkPlayground() {
  return (
    <Section title="FormLink">
      <Example title="Basic">
        <FormLink label="Related page" to="/login">
          Go to login
        </FormLink>
      </Example>
      <Example title="With icon">
        <FormLink label="Customer" icon="fa-solid fa-user" to="/forgot_password">
          John Doe
        </FormLink>
      </Example>
      <Example title="Flex field">
        <FormLink label="Owner" flexField icon="fa-solid fa-user" to="/login">
          Jane Doe
        </FormLink>
      </Example>
      <Example title="Disabled">
        <FormLink label="Disabled" disabled to="/login">
          Not clickable
        </FormLink>
      </Example>
    </Section>
  );
}
