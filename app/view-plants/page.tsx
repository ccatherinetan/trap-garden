'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  getAllPlants,
  getMatchingPlantForUserPlant,
} from '@/api/supabase/queries/plants';
import { getCurrentUserPlantsByUserId } from '@/api/supabase/queries/userPlants';
import FilterDropdownMultiple from '@/components/FilterDropdownMultiple';
import PlantCard from '@/components/PlantCard';
import SearchBar from '@/components/SearchBar';
import COLORS from '@/styles/colors';
import { Box, Flex } from '@/styles/containers';
import { H1 } from '@/styles/text';
import {
  DropdownOption,
  OwnedPlant,
  Plant,
  SeasonEnum,
  SunlightEnum,
} from '@/types/schema';
import {
  checkDifficulty,
  checkGrowingSeason,
  checkSearchTerm,
  checkSunlight,
} from '@/utils/helpers';
import { useProfile } from '@/utils/ProfileProvider';
import {
  AddButton,
  FilterContainer,
  HeaderButton,
  NumberSelectedPlants,
  NumberSelectedPlantsContainer,
  PlantGridContainer,
  SelectButton,
  TopRowContainer,
  ViewSelection,
} from './styles';

// Declaring (static) filter options outside so they're not re-rendered
// TODO: Maybe export shared filter options from a centralized file
const sunlightOptions: DropdownOption<SunlightEnum>[] = [
  { label: 'Less than 2 hours', value: 'SHADE' },
  { label: '2-4 hours', value: 'PARTIAL_SHADE' },
  { label: '4-6 hours', value: 'PARTIAL_SUN' },
  { label: '6+ hours', value: 'FULL' },
];
const difficultyOptions: DropdownOption[] = [
  { label: 'Easy', value: 'EASY' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Hard', value: 'HARD' },
];
const growingSeasonOptions: DropdownOption<SeasonEnum>[] = [
  { label: 'Spring', value: 'SPRING' },
  { label: 'Summer', value: 'SUMMER' },
  { label: 'Fall', value: 'FALL' },
  { label: 'Winter', value: 'WINTER' },
];

export default function Page() {
  const router = useRouter();
  const { hasPlot } = useProfile();
  const [viewingOption, setViewingOption] = useState<'myPlants' | 'all'>(
    hasPlot ? 'myPlants' : 'all',
  );
  const [inAddMode, setInAddMode] = useState<boolean>(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    DropdownOption[]
  >([]);
  const [selectedSunlight, setSelectedSunlight] = useState<
    DropdownOption<SunlightEnum>[]
  >([]);
  const [selectedGrowingSeason, setSelectedGrowingSeason] = useState<
    DropdownOption<SeasonEnum>[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const user_id: UUID = '0802d796-ace8-480d-851b-d16293c74a21';
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [ownedPlants, setOwnedPlants] = useState<OwnedPlant[]>([]);
  // TODO: replace this with state from ProfileContext
  const userState = 'TENNESSEE';

  // Fetch All Plants
  useEffect(() => {
    (async () => {
      const plantList = await getAllPlants();
      // Filter by user's state, since they can only access when onboarded
      // TODO: add userState to dependency array?
      // Sort alphabetically first
      const result = plantList
        .filter(plant => plant.us_state === userState)
        .sort((a, b) => a.plant_name.localeCompare(b.plant_name));
      setPlants(result);
    })();
  }, []);

  // Fetch User Plants for My Garden tab
  useEffect(() => {
    const fetchUserPlants = async () => {
      const fetchedUserPlants = await getCurrentUserPlantsByUserId(user_id);

      const ownedPlants: OwnedPlant[] = await Promise.all(
        fetchedUserPlants.map(async userPlant => {
          const plant = await getMatchingPlantForUserPlant(userPlant);
          return {
            userPlantId: userPlant.id,
            plant,
          };
        }),
      );
      setOwnedPlants(ownedPlants);
    };
    fetchUserPlants();
  }, []);

  const clearFilters = () => {
    setSelectedGrowingSeason([]);
    setSelectedSunlight([]);
    setSelectedDifficulty([]);
  };

  const filteredPlantList = useMemo(() => {
    return plants.filter(
      plant =>
        checkGrowingSeason(selectedGrowingSeason, plant) &&
        checkSunlight(selectedSunlight, plant) &&
        checkDifficulty(selectedDifficulty, plant) &&
        checkSearchTerm(searchTerm, plant),
    );
  }, [
    plants,
    selectedDifficulty,
    selectedSunlight,
    selectedGrowingSeason,
    searchTerm,
  ]);

  const filteredUserPlantList = useMemo(() => {
    return ownedPlants.filter(
      ownedPlant =>
        checkGrowingSeason(selectedGrowingSeason, ownedPlant.plant) &&
        checkSunlight(selectedSunlight, ownedPlant.plant) &&
        checkDifficulty(selectedDifficulty, ownedPlant.plant) &&
        checkSearchTerm(searchTerm, ownedPlant.plant),
    );
  }, [
    ownedPlants,
    selectedDifficulty,
    selectedSunlight,
    selectedGrowingSeason,
    searchTerm,
  ]);

  function handleUserPlantCardClick(ownedPlant: OwnedPlant) {
    router.push(`/plant-page/my-garden/${ownedPlant.userPlantId}`);
  }

  function handlePlantCardClick(plant: Plant) {
    if (inAddMode) {
      if (selectedPlants.includes(plant)) {
        setSelectedPlants(selectedPlants.filter(item => item !== plant));
      } else {
        setSelectedPlants([...selectedPlants, plant]);
      }
    } else {
      router.push(`/plant-page/all-plants/${plant.id}`);
    }
  }
  function handleAddPlants() {
    //TODO: route to add details with proper information
    router.push('/add-details'); // use CONFIG later
  }

  function handleCancelAddMode() {
    setSelectedPlants([]);
    setInAddMode(false);
  }

  const plantPluralityString = selectedPlants.length > 1 ? 'Plants' : 'Plant';

  return (
    <div id="plantContent">
      <TopRowContainer>
        <H1 $color={COLORS.shrub} $fontWeight={500}>
          View Plants
        </H1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterContainer>
          <FilterDropdownMultiple
            value={selectedDifficulty}
            setStateAction={setSelectedDifficulty}
            options={difficultyOptions}
            placeholder="Difficulty Level"
          />
          <FilterDropdownMultiple
            value={selectedSunlight}
            setStateAction={setSelectedSunlight}
            options={sunlightOptions}
            placeholder="Sunlight"
          />
          <FilterDropdownMultiple
            value={selectedGrowingSeason}
            setStateAction={setSelectedGrowingSeason}
            options={growingSeasonOptions}
            placeholder="Growing Season"
          />

          <button onClick={clearFilters}>Clear filters</button>
        </FilterContainer>
      </TopRowContainer>
      <Box $h="24px">
        {viewingOption === 'all' && inAddMode ? (
          <NumberSelectedPlantsContainer>
            <NumberSelectedPlants>
              {selectedPlants.length
                ? `${selectedPlants.length} ${plantPluralityString} Selected`
                : 'Select Plants'}
            </NumberSelectedPlants>
          </NumberSelectedPlantsContainer>
        ) : null}
      </Box>
      <Box $px="24px">
        <Flex $justify="between" $pb="12px">
          <ViewSelection>
            <HeaderButton
              $isCurrentMode={viewingOption !== 'all'}
              onClick={() => setViewingOption('myPlants')}
            >
              My Plants
            </HeaderButton>
            <HeaderButton
              $isCurrentMode={viewingOption === 'all'}
              onClick={() => setViewingOption('all')}
            >
              All
            </HeaderButton>
          </ViewSelection>
          {/* Select/Cancel toggles Add Mode; appears in All plants only*/}
          {viewingOption === 'all' &&
            (inAddMode ? (
              <SelectButton
                $secondaryColor={COLORS.errorRed}
                onClick={handleCancelAddMode}
              >
                Cancel
              </SelectButton>
            ) : (
              <SelectButton
                $primaryColor={COLORS.shrub}
                $secondaryColor="white"
                onClick={() => setInAddMode(true)}
              >
                Select
              </SelectButton>
            ))}
        </Flex>
        {viewingOption === 'myPlants' && (
          <div>
            {filteredUserPlantList.length ? (
              <PlantGridContainer>
                {filteredUserPlantList.map(ownedPlant => (
                  <PlantCard
                    key={ownedPlant.userPlantId}
                    plant={ownedPlant.plant}
                    canSelect={false}
                    onClick={() => handleUserPlantCardClick(ownedPlant)}
                    // aspectRatio="168 / 200"
                  />
                ))}
              </PlantGridContainer>
            ) : (
              <div>
                <button onClick={() => setViewingOption('all')}>
                  Add Plants
                </button>
              </div>
            )}
          </div>
        )}
        {viewingOption === 'all' && (
          <>
            <PlantGridContainer>
              {filteredPlantList.map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  canSelect={inAddMode}
                  isSelected={selectedPlants.includes(plant)}
                  onClick={() => handlePlantCardClick(plant)}
                  // aspectRatio="168 / 200"
                />
              ))}
            </PlantGridContainer>
            {inAddMode && (
              <AddButton
                $backgroundColor={
                  selectedPlants.length ? COLORS.shrub : COLORS.midgray
                }
                onClick={handleAddPlants}
                disabled={!selectedPlants.length}
              >
                {selectedPlants.length ? 'Add to My Garden' : 'Select Plants'}
              </AddButton>
            )}
          </>
        )}
      </Box>
    </div>
  );
}
