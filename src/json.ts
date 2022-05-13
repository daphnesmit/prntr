import { print } from './print';
import { IJsonConfig } from './types';
import { addHeader } from './utils/addHeader';

export type ExtendedJsonConfig = IJsonConfig & {
  frameId: string;
}
function json (config: ExtendedJsonConfig, printFrame: HTMLIFrameElement) {
  const { printable, repeatTableHeader: shouldRepeatTableHeader, properties, header, headerStyle } = config;

  // Check if we received proper data
  if (typeof printable !== 'object') {
    throw new Error('Invalid javascript data object (JSON).');
  }

  // Validate repeatTableHeader
  if (typeof shouldRepeatTableHeader !== 'boolean') {
    throw new Error('Invalid value for repeatTableHeader attribute (JSON).');
  }

  // Validate properties
  if (!properties || !Array.isArray(properties)) {
    throw new Error('Invalid properties array for your JSON data.');
  }

  // We will format the property objects
  const mappedConfig = getConfigWithMappedProperties(config, properties);

  // Create a print container element
  const printableElement = document.createElement('div');

  // Build the printable html data
  printableElement.innerHTML += jsonToHTML(mappedConfig);

  // Check if we are adding a print header
  if (header) {
    addHeader(printableElement, header, headerStyle);
  }

  // Print the json data
  print(mappedConfig, printFrame, printableElement);
}

function capitalizePrint(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getConfigWithMappedProperties(
  config: ExtendedJsonConfig,
  properties: NonNullable<ExtendedJsonConfig['properties']>,
) {
  const mappedProperties = properties.map((property) => ({
    field: typeof property === 'object' ? property.field : property,
    displayName: typeof property === 'object' ? property.displayName : property,
    columnSize: typeof property === 'object' && property.columnSize
      ? `${property.columnSize};`
      : `${100 / properties.length}%;`,
  }));
  return { ...config, properties: mappedProperties };
}

type MappedProperty = { field: string; displayName: string; columnSize: string }
type ConfigWithMappedProperties = ExtendedJsonConfig & {
  properties: MappedProperty[];
}
function jsonToHTML({
  printable,
  properties,
  repeatTableHeader,
  gridHeaderStyle,
  gridStyle,
}: ConfigWithMappedProperties) {
  // Get the row and column data
  const data = printable;

  // Create a html table
  let htmlData = '<table style="border-collapse: collapse; width: 100%;">';

  // Check if the header should be repeated
  if (repeatTableHeader) {
    htmlData += '<thead>';
  }

  // Add the table header row
  htmlData += '<tr>';

  // Add the table header columns
  for (let a = 0; a < properties.length; a++) {
    // eslint-disable-next-line max-len
    htmlData += '<th style="width:' + properties[a].columnSize + ';' + gridHeaderStyle + '">' + capitalizePrint(properties[a].displayName) + '</th>';
  }

  // Add the closing tag for the table header row
  htmlData += '</tr>';

  // If the table header is marked as repeated, add the closing tag
  if (repeatTableHeader) {
    htmlData += '</thead>';
  }

  // Create the table body
  htmlData += '<tbody>';

  // Add the table data rows
  for (let i = 0; i < data.length; i++) {
    // Add the row starting tag
    htmlData += '<tr>';

    // Print selected properties only
    // Not the nicest piece of code..
    for (let n = 0; n < properties.length; n++) {
      let stringData = data[i];

      // Support nested objects
      const property = properties[n].field.split('.');
      if (property.length > 1) {
        for (let p = 0; p < property.length; p++) {
          // @ts-ignore
          stringData = stringData[property[p]];
        }
      } else {
        // @ts-ignore
        stringData = stringData[properties[n].field];
      }

      // Add the row contents and styles
      htmlData += '<td style="width:' + properties[n].columnSize + gridStyle + '">' + stringData + '</td>';
    }

    // Add the row closing tag
    htmlData += '</tr>';
  }

  // Add the table and body closing tags
  htmlData += '</tbody></table>';

  return htmlData;
}

export { json };
