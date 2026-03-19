import { FormattedMessage } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const getPromotionInformationMessage = (addOnType, user, addOnPromotions) => {
  const formatter = new Intl.DateTimeFormat(user.lang === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  var title = (
    <FormattedMessage
      id={`my_plan.subscription_details.addon.${addOnType}_plan.addon_promotion_title`}
      values={{
        Bold: (chunk) => <strong>{chunk}</strong>,
        br: <br />,
      }}
    />
  );

  var partOne = title;

  addOnPromotions.forEach((addOnPromotion, index) => {
    const expirationDate = new Date(addOnPromotion?.expirationDate);
    var quantity = addOnPromotion.quantity;

    if (addOnPromotion.quantity !== '' && !isNaN(addOnPromotion.quantity)) {
      quantity = thousandSeparatorNumber(
        new Intl.Locale(`${user.lang === 'es' ? 'es-ES' : 'en-US'}`),
        addOnPromotion.quantity,
      );
    }

    partOne = (
      <FormattedMessage
        id="parent_message"
        defaultMessage="{partOne} {partTwo}"
        values={{
          partOne: partOne,
          partTwo: (
            <FormattedMessage
              id={`${
                addOnPromotion.idAddOnPlan !== undefined
                  ? `my_plan.subscription_details.addon.${addOnType}_plan.addon_promotion_one_plan_message`
                  : `my_plan.subscription_details.addon.${addOnType}_plan.addon_promotion_all_plans_message`
              }`}
              values={{
                discount: addOnPromotion.discount,
                quantity: quantity,
                expirationDate:
                  addOnPromotion.duration > 0 ? formatter.format(new Date(expirationDate)) : null,
                bold: (chunks) => <b>{chunks}</b>,
                br: <br />,
              }}
            />
          ),
        }}
      />
    );
  });

  return partOne;
};
