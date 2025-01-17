'use client';

import { IconType } from '@/lib/icons';
import COLORS from '@/styles/colors';
import { Flex } from '@/styles/containers';
import { P1, P3 } from '@/styles/text';
import { PlantingTypeEnum } from '@/types/schema';
import { formatTimestamp, toTitleCase } from '@/utils/helpers';
import Icon from '../Icon';
import { Container, Header } from './style';

// import { SmallButton } from '../Buttons';

function DetailRow(iconType: IconType, text: string) {
  return (
    <Flex $align="center" $gap="8px">
      <Icon type={iconType} />
      <P3 $fontWeight={400}>{text}</P3>
    </Flex>
  );
}

export default function YourPlantDetails({
  datePlanted,
  plantingType,
  recentHarvestDate,
}: {
  datePlanted: string;
  plantingType: PlantingTypeEnum;
  recentHarvestDate: string | null;
}) {
  return (
    <Container>
      <Header>
        <P1 $fontWeight={500} $color={COLORS.shrub}>
          Your Plant Details
        </P1>
        {/* <SmallButton $secondaryColor={COLORS.shrub}>Edit</SmallButton> */}
      </Header>
      <Flex $direction="column" $gap="8px">
        {DetailRow('calendar', `Date Planted: ${formatTimestamp(datePlanted)}`)}
        {DetailRow('plantHand', `Planting Type: ${toTitleCase(plantingType)}`)}
        {recentHarvestDate &&
          DetailRow(
            'plant',
            `Most Recent Harvest Date: ${formatTimestamp(recentHarvestDate)}`,
          )}
      </Flex>
    </Container>
  );
}
