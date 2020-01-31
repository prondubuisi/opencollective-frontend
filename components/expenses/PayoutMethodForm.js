import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, defineMessages } from 'react-intl';
import { get, set } from 'lodash';
import { isEmail } from 'validator';

import { PayoutMethodType } from '../../lib/constants/payout-method';
import { FORM_ERROR, formatErrorMessage, createError } from '../../lib/form-utils';
import StyledInputField from '../StyledInputField';
import StyledInput from '../StyledInput';
import { Box } from '@rebass/grid';
import StyledCheckbox from '../StyledCheckbox';
import StyledTextarea from '../StyledTextarea';
import { Field } from 'formik';

const msg = defineMessages({
  email: {
    id: 'Email',
    defaultMessage: 'Email',
  },
  content: {
    id: 'PayoutMethod.Other.content',
    defaultMessage: 'Info',
  },
  savePayout: {
    id: 'ExpenseForm.SavePayout',
    defaultMessage: 'Save this info for future payouts',
  },
});

/** Use this function to validate the payout method */
export const validatePayoutMethod = payoutMethod => {
  const errors = {};

  if (payoutMethod.type === PayoutMethodType.PAYPAL) {
    const email = get(payoutMethod, 'data.email');
    if (!email) {
      set(errors, 'data.email', createError(FORM_ERROR.REQUIRED));
    } else if (!isEmail(email)) {
      set(errors, 'data.email', createError(FORM_ERROR.PATTERN));
    }
  } else if (payoutMethod.type === PayoutMethodType.OTHER) {
    const content = get(payoutMethod, 'data.content');
    if (!content) {
      set(errors, 'data.content', createError(FORM_ERROR.MIN_LENGTH));
    }
  }

  return errors;
};

/**
 * A form to fill infos for a new payout method or to edit an existing one.
 * This component is **fully controlled**, you need to call `validatePayoutMethod`
 * to proceed with the validation and pass the result with the `errors` prop.
 */
const PayoutMethodForm = ({ payoutMethod, fieldsPrefix }) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const isNew = !payoutMethod.id;

  const fixedPrefix = fieldsPrefix ? `${fieldsPrefix}.` : '';
  const getFieldName = field => `${fixedPrefix}${field}`;

  return (
    <Box>
      {payoutMethod.type === PayoutMethodType.PAYPAL && (
        <Field name={getFieldName('data.email')}>
          {({ field, meta }) => (
            <StyledInputField
              name={field.name}
              type="email"
              error={formatErrorMessage(intl, meta.error)}
              label={formatMessage(msg.email)}
              disabled={!isNew}
              required
            >
              {inputProps => <StyledInput placeholder="i.e. yourname@yourhost.com" {...inputProps} {...field} />}
            </StyledInputField>
          )}
        </Field>
      )}
      {payoutMethod.type === PayoutMethodType.OTHER && (
        <Field name={getFieldName('data.content')}>
          {({ field, meta }) => (
            <StyledInputField
              name={field.name}
              type="email"
              error={formatErrorMessage(intl, meta.error)}
              label={formatMessage(msg.content)}
              disabled={!isNew}
              required
            >
              {inputProps => <StyledTextarea minHeight={100} {...inputProps} {...field} />}
            </StyledInputField>
          )}
        </Field>
      )}
      {isNew && (
        <Box mt={3}>
          <Field name={getFieldName('isSaved')}>
            {({ field }) => <StyledCheckbox label={formatMessage(msg.savePayout)} checked={field.value} {...field} />}
          </Field>
        </Box>
      )}
    </Box>
  );
};

PayoutMethodForm.propTypes = {
  /** Set this to nil to create a new one */
  payoutMethod: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(Object.values(PayoutMethodType)).isRequired,
    data: PropTypes.object,
  }).isRequired,
  /** Base name of the field in the form */
  fieldsPrefix: PropTypes.string,
};

export default React.memo(PayoutMethodForm);
