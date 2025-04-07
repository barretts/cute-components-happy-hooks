import { StoryObj } from "@storybook/react/*";
import { Meta } from "storybook/internal/csf";
import StickyScrollbar from "../StickyScrollbar";

const style = `
/* just for visualizing the effect */
.targetScrollable {
  background-color: yellow;
  border: 1px solid red
}

.stickyScrollscrollbarStyle {
  scrollbar-color: yellow red; /* firefox */
}

td {
  border: 1px solid red;
  padding: 0 2px;
}

#root {
  max-width: 1024px;
  padding: 10px;
  background-color: white;
  font-family: sans-serif;
  border: 1px solid red;
}

.html {
  padding: 10px;
  background-color: lightgrey;
}
`;

const StickyScrollbarElm: React.FC<typeof StickyScrollbar> = () => {
  return (
    <div>
      <style>{style}</style>
      <h1>Before</h1>
      <StickyScrollbar>
        <table id="oversizedTable">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Severity</th>
              <th>Phase</th>
              <th>Type</th>
              <th>Record&nbsp;Number</th>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ValueList</td>
              <td>Error</td>
              <td>Importing</td>
              <td>Unanticipated&nbsp;Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>ValueList</td>
              <td>Error</td>
              <td>Importing</td>
              <td>Unanticipated Error While Saving Data</td>
              <td>3</td>
              <td></td>
              <td>
                System.Collections.Generic.KeyNotFoundException: The given key
                'ListValue.IntegrationId[0]' was not present in the dictionary.
                at System.Collections.Generic.Dictionary`2.get_Item(TKey key) at
                Domain.DataPorting.ValueListImport.ValueListImportPolicy.CreateAndSaveEntity(ImportDataRecord
                record) in C:\code\ValueListImport\ValueListImporter.cs:line 94
                at
                Domain.DataPorting.DataImport.EntityImporter`1.ProcessEntities(ImportDataTable
                dataTable, Import import) in
                C:\code\DataImport\EntityImporter.cs:line 599
              </td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating&nbsp;Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[0]</td>
              <td>Could not resolve value 'brandon' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[1]</td>
              <td>Could not resolve value 'annie' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[2]</td>
              <td>Could not resolve value 'bob' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Site</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>SlaDefinition</td>
              <td>Error</td>
              <td>Resolving References</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating&nbsp;Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[0]</td>
              <td>Could not resolve value 'brandon' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[1]</td>
              <td>Could not resolve value 'annie' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[2]</td>
              <td>Could not resolve value 'bob' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Site</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>SlaDefinition</td>
              <td>Error</td>
              <td>Resolving References</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating&nbsp;Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[0]</td>
              <td>Could not resolve value 'brandon' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[1]</td>
              <td>Could not resolve value 'annie' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Referenced Entity Resolution Failure</td>
              <td>1</td>
              <td>User.LoginCredentials.Username[2]</td>
              <td>Could not resolve value 'bob' as a(n) 'User'.</td>
            </tr>
            <tr>
              <td>Site</td>
              <td>Error</td>
              <td>Validating Data</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
            <tr>
              <td>SlaDefinition</td>
              <td>Error</td>
              <td>Resolving References</td>
              <td>Unanticipated Error</td>
              <td></td>
              <td></td>
              <td>
                An unanticipated error has interrupted the data import process.
              </td>
            </tr>
          </tbody>
        </table>
      </StickyScrollbar>
      <h1>After</h1>
    </div>
  );
};

const meta: Meta<typeof StickyScrollbarElm> = {
  title: "Components/StickyScrollbar",
  component: StickyScrollbarElm,
  argTypes: {},
};

export default meta;

// Template for stories.
type Story = StoryObj<typeof StickyScrollbar>;

// Default story using the default hook options.
export const Default: Story = {
  args: {},
};

// Story with custom options for the animation.
export const CustomOptions: Story = {
  args: {},
};
