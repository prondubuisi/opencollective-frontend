import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';
import styled from 'styled-components';
import { layout } from 'styled-system';

import { CollectiveType } from '../../constants/collectives';
import { formatCurrency } from '../../lib/utils';
import withViewport from '../../lib/withViewport';
import Container from '../Container';
import Link from '../Link';
import { H4, P, Span } from '../Text';
import Avatar from '../Avatar';

import TopContributorsBackgroundSVG from './TopContributorsBackground.svg';

/** The container for Top Contributors view */
const TopContributorsContainer = styled.div`
  min-height: 425px;
  padding: 32px 16px;
  margin-top: 48px;
  background: url(${TopContributorsBackgroundSVG}) no-repeat center;
  background-color: #f5f7fa;
`;

const ContributorsList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 400px;
  ${layout}
`;

const AvatarWithRank = styled.div`
  width: 63px;
  height: 32px;
  margin-right: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 14px;
  font-size: 10px;
  border-radius: 32px;
  border: 1px solid #dcdee0;
`;

const ContributorRow = ({
  rank,
  currency,
  contributor: { since, totalAmountDonated, image, name, type, collectiveSlug },
}) => (
  <Flex my={3} mr={3}>
    <Link route="new-collective-page" params={{ slug: collectiveSlug }}>
      <AvatarWithRank>
        <span>{rank}</span>
        <Avatar type={type} radius={30} borderRadius="50%" src={image} name={name} />
      </AvatarWithRank>
    </Link>
    <div>
      <P fontWeight="bold">{name}</P>
      <P color="black.500">
        <Span fontWeight="bold">{formatCurrency(totalAmountDonated, currency)}</Span> since{' '}
        <FormattedDate value={since} month="long" year="numeric" />
      </P>
    </div>
  </Flex>
);

ContributorRow.propTypes = {
  rank: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  contributor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(CollectiveType)).isRequired,
    collectiveSlug: PropTypes.string.isRequired,
    totalAmountDonated: PropTypes.number.isRequired,
    since: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

/**
 * Shows two columns as leaderboards for organizations and individuals
 * financial contributions.
 */
const TopContributors = ({ topOrganizations, topIndividuals, currency }) => {
  return (
    <TopContributorsContainer>
      <Container maxWidth={1200} m="0 auto">
        <H4 fontWeight="normal" mb={3}>
          <FormattedMessage id="SectionContribute.TopContributors" defaultMessage="Top Contributors" />
        </H4>
        <Flex mt={2} justifyContent="space-between" flexWrap="wrap">
          {topOrganizations && topOrganizations.length > 0 && (
            <div>
              <P fontSize="LeadParagraph">
                <FormattedMessage id="TopContributors.Organizations" defaultMessage="Organizations" />
              </P>
              <Flex>
                <ContributorsList>
                  {topOrganizations.slice(0, 5).map((contributor, idx) => (
                    <ContributorRow key={contributor.id} rank={idx + 1} contributor={contributor} currency={currency} />
                  ))}
                </ContributorsList>
                <ContributorsList display={['none', null, 'flex']}>
                  {topOrganizations.slice(5, 10).map((contributor, idx) => (
                    <ContributorRow key={contributor.id} rank={idx + 6} contributor={contributor} currency={currency} />
                  ))}
                </ContributorsList>
              </Flex>
            </div>
          )}
          {topIndividuals && topIndividuals.length > 0 && (
            <div>
              <P fontSize="LeadParagraph">
                <FormattedMessage id="TopContributors.Individuals" defaultMessage="Individuals" />
              </P>
              <Flex>
                <ContributorsList>
                  {topIndividuals.slice(0, 5).map((contributor, idx) => (
                    <ContributorRow key={contributor.id} rank={idx + 1} contributor={contributor} currency={currency} />
                  ))}
                </ContributorsList>
                <ContributorsList display={['none', null, 'flex']}>
                  {topIndividuals.slice(5, 10).map((contributor, idx) => (
                    <ContributorRow key={contributor.id} rank={idx + 6} contributor={contributor} currency={currency} />
                  ))}
                </ContributorsList>
              </Flex>
            </div>
          )}
        </Flex>
      </Container>
    </TopContributorsContainer>
  );
};

TopContributors.propTypes = {
  currency: PropTypes.string.isRequired,
  topOrganizations: PropTypes.arrayOf(PropTypes.object),
  topIndividuals: PropTypes.arrayOf(PropTypes.object),
};

export default withViewport(TopContributors);
