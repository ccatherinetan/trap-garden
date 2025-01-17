import { StylesConfig } from 'react-select';
import COLORS from '@/styles/colors';
import { DropdownOption } from '@/types/schema';

// custom styles for react-select component
// Option type is DropdownOption<T> and isMulti is true
export const customSelectStyles = <T>(): StylesConfig<
  DropdownOption<T>,
  true
> => ({
  // container
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: '56px',
    height: '30px',
    border: `0.5px solid ${COLORS.midgray}`,
    backgroundColor: state.isDisabled ? COLORS.lightgray : '#fff',
    padding: '8px 14px',
    color: COLORS.midgray,
    minWidth: '138px',
    width: 'max-content', // prevent collapse on scroll
  }),
  // placeholder text
  placeholder: baseStyles => ({
    ...baseStyles,
    color: COLORS.midgray,
    fontSize: '0.75rem',
    fontWeight: 400,
    padding: '0px',
    margin: 'auto',
  }),
  // hide vertical bar between arrow and text
  indicatorSeparator: baseStyles => ({
    ...baseStyles,
    display: 'none',
  }),
  // 'x' to clear selected option(s)
  clearIndicator: baseStyles => ({
    ...baseStyles,
    padding: '0px',
  }),
  // dropdown arrow
  dropdownIndicator: baseStyles => ({
    ...baseStyles,
    padding: '0px',
    marginLeft: '-4px', // move the dropdown indicator to the left, cant override text styles
    color: COLORS.midgray,
  }),
  menu: baseStyles => ({
    ...baseStyles,
    minWidth: 'max-content',
  }),
  // container for selected multi option
  multiValue: baseStyles => ({
    ...baseStyles,
    backgroundColor: '#fff',
    border: '0px',
    padding: '0px',
    margin: '0px',
  }),
  // The following styles aren't used (see CustomMultiValue)
  // multi option display text
  // multiValueLabel: baseStyles => ({
  //   ...baseStyles,
  //   fontSize: '0.75rem',
  //   color: `${COLORS.black}`,
  //   padding: '0px',
  // }),
  // // hide 'x' next to each multi option
  // multiValueRemove: baseStyles => ({
  //   ...baseStyles,
  //   display: 'none',
  // }),
  option: baseStyles => ({
    ...baseStyles,
    // style as a P3 with fontWeight 400
    fontSize: '0.75rem',
    fontWeight: 400,
  }),
});
