import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import initialStatesData from '@/data/india_state_list.json';

export interface StateItem {
  id: string | number;
  name: string;
  districts?: DistrictItem[];
}

export interface DistrictItem {
  id: string | number;
  name: string;
  stateId?: string | number;
  createdAt?: string;
}

export interface AssemblyConstituencyItem {
  id: string;
  name: string;
  lokSabhaId?: string;
  districtId: number | string;
  ruralEnabled: boolean;
  urbanEnabled: boolean;
  createdAt?: string;
}

export interface BlockItem {
  id: string;
  name: string;
  districtId: number | string;
  assemblyId?: string;
  unitType?: 'RURAL_BLOCK';
  createdAt?: string;
}

export interface UrbanLocalBodyItem {
  id: string;
  name: string;
  ulbType: 'MUNICIPALITY' | 'NAC' | 'MUNICIPAL_CORPORATION' | 'OTHER';
  districtId: number | string;
  assemblyId?: string;
  createdAt?: string;
}

export interface PanchayatItem {
  id: string;
  name: string;
  blockId: string;
  assemblyId?: string;
  gpNumber?: number;
  totalPopulation?: number;
  malePopulation?: number;
  femalePopulation?: number;
  stPopulation?: number;
  scPopulation?: number;
  ocPopulation?: number;
  wardCount?: number;
  census2011Population?: number;
  census2027Population?: number;
  createdAt?: string;
}

export interface VillageItem {
  id: string;
  name: string;
  panchayatId: string;
  blockId?: string;
  households?: number;
  totalPopulation?: number;
  malePopulation?: number;
  femalePopulation?: number;
  stPopulation?: number;
  scPopulation?: number;
  ocPopulation?: number;
  census2011Population?: number;
  census2027Population?: number;
  createdAt?: string;
}

export interface WardItem {
  id: string;
  name: string;
  wardNumber?: number | string;
  parentType: 'VILLAGE' | 'ULB';
  parentId: string; // villageId if rural, ulbId if urban
  assemblyId?: string;
  malePopulation?: number;
  femalePopulation?: number;
  census2011Population?: number;
  census2027Population?: number;
  boothIds?: string[];
  createdAt?: string;
}

export interface BoothItem {
  id: string;
  name: string;
  wardId?: string; // primary ward (legacy support)
  wardIds?: string[]; // multi-ward support (multiple wards make a booth)
  assemblyId?: string;
  totalVoters?: number;
  maleVoters?: number;
  femaleVoters?: number;
  createdAt?: string;
}

interface HierarchyState {
  states: StateItem[];
  districts: DistrictItem[];
  assemblyConstituencies: AssemblyConstituencyItem[];
  blocks: BlockItem[];
  urbanLocalBodies: UrbanLocalBodyItem[];
  panchayats: PanchayatItem[];
  villages: VillageItem[];
  wards: WardItem[];
  booths: BoothItem[];

  // CRUD Actions for Districts
  addDistrict: (district: Omit<DistrictItem, 'id' | 'createdAt'>) => DistrictItem;
  updateDistrict: (id: string | number, updates: Partial<DistrictItem>) => void;
  deleteDistrict: (id: string | number) => { success: boolean; error?: string };

  // CRUD Actions for Assembly Constituencies
  addAssemblyConstituency: (ac: Omit<AssemblyConstituencyItem, 'id' | 'createdAt'>) => AssemblyConstituencyItem;
  updateAssemblyConstituency: (id: string, updates: Partial<AssemblyConstituencyItem>) => void;
  deleteAssemblyConstituency: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Rural Blocks
  addBlock: (block: Omit<BlockItem, 'id' | 'createdAt'>) => BlockItem;
  updateBlock: (id: string, updates: Partial<BlockItem>) => void;
  deleteBlock: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Urban Local Bodies
  addULB: (ulb: Omit<UrbanLocalBodyItem, 'id' | 'createdAt'>) => UrbanLocalBodyItem;
  updateULB: (id: string, updates: Partial<UrbanLocalBodyItem>) => void;
  deleteULB: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Gram Panchayats
  addPanchayat: (panchayat: Omit<PanchayatItem, 'id' | 'createdAt'>) => PanchayatItem;
  updatePanchayat: (id: string, updates: Partial<PanchayatItem>) => void;
  deletePanchayat: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Villages
  addVillage: (village: Omit<VillageItem, 'id' | 'createdAt'>) => VillageItem;
  updateVillage: (id: string, updates: Partial<VillageItem>) => void;
  deleteVillage: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Wards (Rural & Urban)
  addWard: (ward: Omit<WardItem, 'id' | 'createdAt'>) => WardItem;
  updateWard: (id: string, updates: Partial<WardItem>) => void;
  deleteWard: (id: string) => { success: boolean; error?: string };

  // CRUD Actions for Polling Booths
  addBooth: (booth: Omit<BoothItem, 'id' | 'createdAt'>) => BoothItem;
  updateBooth: (id: string, updates: Partial<BoothItem>) => void;
  deleteBooth: (id: string) => { success: boolean; error?: string };

  // Cascading Getters
  getDistrictsByState: (stateId: number | string) => DistrictItem[];
  getAssembliesByDistrict: (districtId: number | string) => AssemblyConstituencyItem[];
  getBlocksByDistrict: (districtId: number | string) => BlockItem[];
  getBlocksByAssembly: (assemblyId?: string, districtId?: number | string) => BlockItem[];
  getULBsByDistrict: (districtId: number | string) => UrbanLocalBodyItem[];
  getULBsByAssembly: (assemblyId?: string, districtId?: number | string) => UrbanLocalBodyItem[];
  getPanchayatsByBlock: (blockId: string) => PanchayatItem[];
  getVillagesByPanchayat: (panchayatId: string) => VillageItem[];
  getWardsByVillage: (villageId: string) => WardItem[];
  getWardsByULB: (ulbId: string) => WardItem[];
  getBoothsByWard: (wardId: string) => BoothItem[];
  getWardsByBooth: (boothId: string) => WardItem[];
}

function parseInitialHierarchy() {
  const extractedDistricts: DistrictItem[] = [];
  const extractedAssemblies: AssemblyConstituencyItem[] = [];
  const extractedBlocks: BlockItem[] = [];
  const extractedULBs: UrbanLocalBodyItem[] = [];
  const extractedPanchayats: PanchayatItem[] = [];
  const extractedVillages: VillageItem[] = [];
  const extractedWards: WardItem[] = [];
  const extractedBooths: BoothItem[] = [];

  const seenDistrictIds = new Set<string>();
  const seenAssemblyIds = new Set<string>();
  const seenBlockIds = new Set<string>();
  const seenUlbIds = new Set<string>();
  const seenPanchayatIds = new Set<string>();
  const seenVillageIds = new Set<string>();
  const seenWardIds = new Set<string>();
  const seenBoothIds = new Set<string>();

  (initialStatesData as any[]).forEach((state) => {
    if (state.districts && Array.isArray(state.districts)) {
      state.districts.forEach((district: any) => {
        // Extract District
        const dId = String(district.id);
        if (!seenDistrictIds.has(dId)) {
          seenDistrictIds.add(dId);
          extractedDistricts.push({
            id: district.id,
            name: district.name,
            stateId: state.id,
          });
        }

        // 1. Extract Constituencies from JSON
        if (district.constituencies && Array.isArray(district.constituencies)) {
          district.constituencies.forEach((ac: any) => {
            const acId = String(ac.id);
            if (!seenAssemblyIds.has(acId)) {
              seenAssemblyIds.add(acId);
              extractedAssemblies.push({
                id: ac.id,
                name: ac.name,
                districtId: district.id,
                ruralEnabled: ac.ruralEnabled ?? true,
                urbanEnabled: ac.urbanEnabled ?? true,
              });
            }
          });
        }

        // 2. Extract Urban Local Bodies from JSON
        if (district.urbanBodies && Array.isArray(district.urbanBodies)) {
          district.urbanBodies.forEach((ulb: any) => {
            const ulbId = String(ulb.id);
            if (!seenUlbIds.has(ulbId)) {
              seenUlbIds.add(ulbId);
              extractedULBs.push({
                id: ulb.id,
                name: ulb.name,
                ulbType: ulb.ulbType || 'MUNICIPALITY',
                districtId: district.id,
                assemblyId: ulb.assemblyId,
              });

              // Extract Municipal Wards & Booths under ULB
              if (ulb.wards && Array.isArray(ulb.wards)) {
                ulb.wards.forEach((wrd: any) => {
                  const wrdId = String(wrd.id);
                  if (!seenWardIds.has(wrdId)) {
                    seenWardIds.add(wrdId);
                    extractedWards.push({
                      id: wrd.id,
                      name: wrd.name,
                      parentType: 'ULB',
                      parentId: ulb.id,
                      assemblyId: ulb.assemblyId,
                    });

                    // Extract Booths
                    if (wrd.booths && Array.isArray(wrd.booths)) {
                      wrd.booths.forEach((bth: any) => {
                        const bthId = String(bth.id);
                        if (!seenBoothIds.has(bthId)) {
                          seenBoothIds.add(bthId);
                          extractedBooths.push({
                            id: bth.id,
                            name: bth.name,
                            wardId: wrd.id,
                            assemblyId: ulb.assemblyId,
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }

        // 3. Extract Rural Blocks, Panchayats, Villages, Wards & Booths from JSON
        if (district.blocks && Array.isArray(district.blocks)) {
          district.blocks.forEach((blk: any) => {
            const blockId = String(blk.id || `blk-${Math.random().toString(36).slice(2, 8)}`);
            let assignedAssembly = blk.assemblyId;

            // Dynamically match block to assembly from the district's own constituencies list
            if (!assignedAssembly && district.constituencies && Array.isArray(district.constituencies)) {
              const cleanBlockName = (blk.name || '').replace(/block|rural/gi, '').trim().toLowerCase();
              const matchedAc = district.constituencies.find((ac: any) => {
                const cleanAcName = (ac.name || '').replace(/assembly|vidhan\s*sabha|constituency/gi, '').trim().toLowerCase();
                return cleanAcName && (cleanBlockName === cleanAcName || cleanBlockName.includes(cleanAcName) || cleanAcName.includes(cleanBlockName));
              });
              if (matchedAc) {
                assignedAssembly = String(matchedAc.id);
              }
            }

            if (!seenBlockIds.has(blockId)) {
              seenBlockIds.add(blockId);
              extractedBlocks.push({
                id: blockId,
                name: blk.name,
                districtId: district.id,
                assemblyId: assignedAssembly,
                unitType: 'RURAL_BLOCK',
              });
            }

            // Extract Panchayats
            if (blk.panchayats && Array.isArray(blk.panchayats)) {
              blk.panchayats.forEach((pan: any) => {
                const panId = String(pan.id);
                if (!seenPanchayatIds.has(panId)) {
                  seenPanchayatIds.add(panId);
                  extractedPanchayats.push({
                    id: pan.id,
                    name: pan.name,
                    blockId: blockId,
                    assemblyId: assignedAssembly,
                  });

                  // Extract Villages
                  if (pan.villages && Array.isArray(pan.villages)) {
                    pan.villages.forEach((vil: any) => {
                      const vilId = String(vil.id);
                      if (!seenVillageIds.has(vilId)) {
                        seenVillageIds.add(vilId);
                        extractedVillages.push({
                          id: vil.id,
                          name: vil.name,
                          panchayatId: pan.id,
                        });

                        // Extract Rural Wards
                        if (vil.wards && Array.isArray(vil.wards)) {
                          vil.wards.forEach((wrd: any) => {
                            const wId = String(wrd.id);
                            if (!seenWardIds.has(wId)) {
                              seenWardIds.add(wId);
                              extractedWards.push({
                                id: wrd.id,
                                name: wrd.name,
                                parentType: 'VILLAGE',
                                parentId: vil.id,
                                assemblyId: assignedAssembly,
                              });

                              // Extract Booths
                              if (wrd.booths && Array.isArray(wrd.booths)) {
                                wrd.booths.forEach((bth: any) => {
                                  const bId = String(bth.id);
                                  if (!seenBoothIds.has(bId)) {
                                    seenBoothIds.add(bId);
                                    extractedBooths.push({
                                      id: bth.id,
                                      name: bth.name,
                                      wardId: wrd.id,
                                      assemblyId: assignedAssembly,
                                    });
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });

  // Clean up and strictly restrict to Korei Constituency hierarchy:
  // Korei Constituency has exactly 2 Blocks (Korei, Rasulpur) and 1 Municipality (Vyasanagar Municipality)
  const koreiAssemblyId = '126013001';
  const jajpurDistrictId = '126013';

  // 1. Strict Blocks: Korei & Rasulpur
  const filteredBlocks: BlockItem[] = [
    {
      id: '126013008',
      name: 'Korei',
      districtId: jajpurDistrictId,
      assemblyId: koreiAssemblyId,
      unitType: 'RURAL_BLOCK',
    },
    {
      id: '126013009',
      name: 'Rasulpur',
      districtId: jajpurDistrictId,
      assemblyId: koreiAssemblyId,
      unitType: 'RURAL_BLOCK',
    },
  ];

  // 2. Strict Urban Local Bodies: Vyasanagar Municipality only
  const filteredULBs: UrbanLocalBodyItem[] = [
    {
      id: '126013901',
      name: 'Vyasanagar Municipality',
      ulbType: 'MUNICIPALITY',
      districtId: jajpurDistrictId,
      assemblyId: koreiAssemblyId,
    },
  ];

  // 3. Pre-seed all 28 Gram Panchayats of Korei Block with exact Census 2011 figures from PDF
  const koreiBlockId = '126013008';
  const rasulpurBlockId = '126013009';

  const koreiGPsData = [
    { gpNumber: 1, name: 'Amrutia', male: 2888, female: 2872, total: 5760, st: 410, sc: 1718, oc: 3632, wardCount: 15 },
    { gpNumber: 2, name: 'Andhari', male: 2811, female: 2612, total: 5423, st: 595, sc: 1580, oc: 3248, wardCount: 11 },
    { gpNumber: 3, name: 'Asanjhar', male: 2256, female: 1981, total: 4237, st: 568, sc: 524, oc: 3145, wardCount: 13 },
    { gpNumber: 4, name: 'Badabiruan', male: 2281, female: 2218, total: 4499, st: 4, sc: 1844, oc: 2651, wardCount: 13 },
    { gpNumber: 5, name: 'Tandara', male: 1808, female: 1681, total: 3489, st: 9, sc: 832, oc: 2648, wardCount: 9 },
    { gpNumber: 6, name: 'Bandalo', male: 2387, female: 2620, total: 5007, st: 202, sc: 1605, oc: 3200, wardCount: 15 },
    { gpNumber: 7, name: 'Barundei', male: 2380, female: 2358, total: 4738, st: 93, sc: 1337, oc: 3308, wardCount: 11 },
    { gpNumber: 8, name: 'Tarakote', male: 2337, female: 2337, total: 4674, st: 10, sc: 1013, oc: 3651, wardCount: 11 },
    { gpNumber: 9, name: 'Dhaneswar', male: 4246, female: 4021, total: 8267, st: 385, sc: 2847, oc: 5035, wardCount: 22 },
    { gpNumber: 10, name: 'Goleipur', male: 4233, female: 3986, total: 8219, st: 75, sc: 2347, oc: 5797, wardCount: 22 },
    { gpNumber: 11, name: 'Gourpur', male: 2764, female: 2736, total: 5500, st: 607, sc: 1251, oc: 3642, wardCount: 17 },
    { gpNumber: 12, name: 'Jahna', male: 3555, female: 3324, total: 6879, st: 346, sc: 1568, oc: 4965, wardCount: 19 },
    { gpNumber: 13, name: 'Khaman', male: 3790, female: 3572, total: 7362, st: 77, sc: 1909, oc: 5376, wardCount: 23 },
    { gpNumber: 14, name: 'Kantore', male: 2485, female: 2312, total: 4797, st: 408, sc: 1707, oc: 2682, wardCount: 12 },
    { gpNumber: 15, name: 'Kacharasahi', male: 2628, female: 2502, total: 5130, st: 943, sc: 907, oc: 3280, wardCount: 12 },
    { gpNumber: 16, name: 'Karada', male: 3432, female: 3375, total: 6807, st: 407, sc: 1679, oc: 4721, wardCount: 13 },
    { gpNumber: 17, name: 'Mukundapur', male: 3348, female: 3293, total: 6641, st: 525, sc: 1782, oc: 4334, wardCount: 17 },
    { gpNumber: 18, name: 'Mulapal', male: 2728, female: 2856, total: 5584, st: 879, sc: 1355, oc: 3350, wardCount: 12 },
    { gpNumber: 19, name: 'Pachhikote', male: 3412, female: 3399, total: 6811, st: 1404, sc: 2099, oc: 3308, wardCount: 14 },
    { gpNumber: 20, name: 'Nuapada', male: 1658, female: 1516, total: 3174, st: 513, sc: 418, oc: 2243, wardCount: 7 },
    { gpNumber: 21, name: 'Paniharapada', male: 3380, female: 3168, total: 6548, st: 948, sc: 1263, oc: 4237, wardCount: 13 },
    { gpNumber: 22, name: 'Panikoili', male: 3073, female: 2965, total: 6038, st: 156, sc: 1503, oc: 4379, wardCount: 12 },
    { gpNumber: 23, name: 'Ranapur', male: 2002, female: 1902, total: 3904, st: 273, sc: 1017, oc: 2614, wardCount: 12 },
    { gpNumber: 24, name: 'Haladigadia', male: 1765, female: 1773, total: 3538, st: 11, sc: 912, oc: 2615, wardCount: 10 },
    { gpNumber: 25, name: 'Taharpur', male: 2440, female: 2262, total: 4702, st: 549, sc: 1134, oc: 3019, wardCount: 17 },
    { gpNumber: 26, name: 'Talarada', male: 2470, female: 2405, total: 4875, st: 21, sc: 1570, oc: 3284, wardCount: 13 },
    { gpNumber: 27, name: 'Pataranga', male: 2382, female: 2301, total: 4683, st: 1474, sc: 1015, oc: 2194, wardCount: 12 },
    { gpNumber: 28, name: 'Tulati', male: 2828, female: 2754, total: 5582, st: 477, sc: 2054, oc: 3051, wardCount: 18 },
  ];

  const filteredPanchayats: PanchayatItem[] = koreiGPsData.map((gp) => ({
    id: `${koreiBlockId}${String(gp.gpNumber).padStart(3, '0')}`,
    name: `${gp.name} GP`,
    blockId: koreiBlockId,
    assemblyId: koreiAssemblyId,
    gpNumber: gp.gpNumber,
    totalPopulation: gp.total,
    malePopulation: gp.male,
    femalePopulation: gp.female,
    stPopulation: gp.st,
    scPopulation: gp.sc,
    ocPopulation: gp.oc,
    wardCount: gp.wardCount,
    census2011Population: gp.total,
    census2027Population: Math.round(gp.total * 1.44), // approx 2027 demographic projection
  }));

  // Seed Panchayats for Rasulpur Block (9 Official GPs from Census Document)
  const rasulpurGPsData = [
    { gpNumber: 1, name: 'Badakainchi GP', male: 3834, female: 3611, total: 7445, st: 420, sc: 1950, oc: 5075, wardCount: 15 },
    { gpNumber: 2, name: 'Bahadalapur GP', male: 2800, female: 2716, total: 5516, st: 210, sc: 1480, oc: 3826, wardCount: 14 },
    { gpNumber: 3, name: 'Bhotaka GP', male: 2736, female: 2563, total: 5299, st: 340, sc: 1390, oc: 3569, wardCount: 13 },
    { gpNumber: 4, name: 'Gandhan GP', male: 3079, female: 3000, total: 6079, st: 190, sc: 1620, oc: 4269, wardCount: 16 },
    { gpNumber: 5, name: 'Laxminagar GP', male: 3221, female: 3115, total: 6336, st: 280, sc: 1740, oc: 4316, wardCount: 15 },
    { gpNumber: 6, name: 'Mugupal GP', male: 2704, female: 2668, total: 5372, st: 150, sc: 1380, oc: 3842, wardCount: 14 },
    { gpNumber: 7, name: 'Narasinghpur GP', male: 4150, female: 3866, total: 8016, st: 490, sc: 2150, oc: 5376, wardCount: 18 },
    { gpNumber: 8, name: 'Pahanga GP', male: 2439, female: 2342, total: 4781, st: 180, sc: 1290, oc: 3311, wardCount: 12 },
    { gpNumber: 9, name: 'Tikarpada GP', male: 1397, female: 1343, total: 2740, st: 95, sc: 740, oc: 1905, wardCount: 8 },
  ];

  rasulpurGPsData.forEach((gp) => {
    filteredPanchayats.push({
      id: `${rasulpurBlockId}${String(gp.gpNumber).padStart(3, '0')}`,
      name: gp.name,
      blockId: rasulpurBlockId,
      assemblyId: koreiAssemblyId,
      gpNumber: gp.gpNumber,
      totalPopulation: gp.total,
      malePopulation: gp.male,
      femalePopulation: gp.female,
      stPopulation: gp.st,
      scPopulation: gp.sc,
      ocPopulation: gp.oc,
      wardCount: gp.wardCount,
      census2011Population: gp.total,
      census2027Population: Math.round(gp.total * 1.44),
    });
  });

  // 4. Pre-seed Revenue Villages under both Korei & Rasulpur Gram Panchayats
  const seededRevenueVillages: VillageItem[] = [
    // --- Rasulpur Block Revenue Villages ---
    // Badakainchi GP (126013009001)
    { id: '126013009001001', name: 'Badakainchi', panchayatId: '126013009001', blockId: rasulpurBlockId, households: 769, malePopulation: 2000, femalePopulation: 1909, totalPopulation: 3909, census2011Population: 3909, census2027Population: 5629 },
    { id: '126013009001002', name: 'Garual', panchayatId: '126013009001', blockId: rasulpurBlockId, households: 204, malePopulation: 560, femalePopulation: 498, totalPopulation: 1058, census2011Population: 1058, census2027Population: 1524 },
    { id: '126013009001003', name: 'Gopinathpur', panchayatId: '126013009001', blockId: rasulpurBlockId, households: 340, malePopulation: 842, femalePopulation: 820, totalPopulation: 1662, census2011Population: 1662, census2027Population: 2393 },
    { id: '126013009001004', name: 'Gordha', panchayatId: '126013009001', blockId: rasulpurBlockId, households: 159, malePopulation: 432, femalePopulation: 384, totalPopulation: 816, census2011Population: 816, census2027Population: 1175 },

    // Bahadalapur GP (126013009002)
    { id: '126013009002001', name: 'Bada niranjanpur', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 139, malePopulation: 409, femalePopulation: 354, totalPopulation: 763, census2011Population: 763, census2027Population: 1099 },
    { id: '126013009002002', name: 'Bahadalapur', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 154, malePopulation: 308, femalePopulation: 338, totalPopulation: 646, census2011Population: 646, census2027Population: 930 },
    { id: '126013009002003', name: 'Faridabad', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 251, malePopulation: 639, femalePopulation: 606, totalPopulation: 1245, census2011Population: 1245, census2027Population: 1793 },
    { id: '126013009002004', name: 'Kamarpal', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 61, malePopulation: 149, femalePopulation: 148, totalPopulation: 297, census2011Population: 297, census2027Population: 428 },
    { id: '126013009002005', name: 'Kuakhia', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 15, malePopulation: 42, femalePopulation: 46, totalPopulation: 88, census2011Population: 88, census2027Population: 127 },
    { id: '126013009002006', name: 'Mahammdpur', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 101, malePopulation: 239, femalePopulation: 249, totalPopulation: 488, census2011Population: 488, census2027Population: 703 },
    { id: '126013009002007', name: 'Orali', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 291, malePopulation: 767, femalePopulation: 732, totalPopulation: 1499, census2011Population: 1499, census2027Population: 2159 },
    { id: '126013009002008', name: 'Sarifabad', panchayatId: '126013009002', blockId: rasulpurBlockId, households: 107, malePopulation: 247, femalePopulation: 243, totalPopulation: 490, census2011Population: 490, census2027Population: 706 },

    // Bhotaka GP (126013009003)
    { id: '126013009003001', name: 'Arada', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 116, malePopulation: 293, femalePopulation: 268, totalPopulation: 561, census2011Population: 561, census2027Population: 808 },
    { id: '126013009003002', name: 'Badarampei', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 44, malePopulation: 108, femalePopulation: 99, totalPopulation: 207, census2011Population: 207, census2027Population: 298 },
    { id: '126013009003003', name: 'Bhotaka', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 430, malePopulation: 1111, femalePopulation: 1058, totalPopulation: 2169, census2011Population: 2169, census2027Population: 3123 },
    { id: '126013009003004', name: 'Bilipada', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 257, malePopulation: 567, femalePopulation: 501, totalPopulation: 1068, census2011Population: 1068, census2027Population: 1538 },
    { id: '126013009003005', name: 'Ichhapur', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 188, malePopulation: 429, femalePopulation: 417, totalPopulation: 846, census2011Population: 846, census2027Population: 1218 },
    { id: '126013009003006', name: 'Sanarampei', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 44, malePopulation: 116, femalePopulation: 97, totalPopulation: 213, census2011Population: 213, census2027Population: 307 },
    { id: '126013009003007', name: 'Serapur', panchayatId: '126013009003', blockId: rasulpurBlockId, households: 43, malePopulation: 112, femalePopulation: 123, totalPopulation: 235, census2011Population: 235, census2027Population: 338 },

    // Gandhan GP (126013009004)
    { id: '126013009004001', name: 'Bantara', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 214, malePopulation: 545, femalePopulation: 501, totalPopulation: 1046, census2011Population: 1046, census2027Population: 1506 },
    { id: '126013009004002', name: 'Bramhan Narsinghpur', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 122, malePopulation: 278, femalePopulation: 299, totalPopulation: 577, census2011Population: 577, census2027Population: 831 },
    { id: '126013009004003', name: 'Darkundi', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 124, malePopulation: 301, femalePopulation: 274, totalPopulation: 575, census2011Population: 575, census2027Population: 828 },
    { id: '126013009004004', name: 'Ekatala', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 280, malePopulation: 694, femalePopulation: 669, totalPopulation: 1363, census2011Population: 1363, census2027Population: 1963 },
    { id: '126013009004005', name: 'Gandhan', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 242, malePopulation: 547, femalePopulation: 531, totalPopulation: 1078, census2011Population: 1078, census2027Population: 1552 },
    { id: '126013009004006', name: 'Masurapur', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 108, malePopulation: 188, femalePopulation: 209, totalPopulation: 397, census2011Population: 397, census2027Population: 572 },
    { id: '126013009004007', name: 'Parikainchi', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 126, malePopulation: 267, femalePopulation: 255, totalPopulation: 522, census2011Population: 522, census2027Population: 752 },
    { id: '126013009004008', name: 'Tulasipur', panchayatId: '126013009004', blockId: rasulpurBlockId, households: 110, malePopulation: 259, femalePopulation: 262, totalPopulation: 521, census2011Population: 521, census2027Population: 750 },

    // Laxminagar GP (126013009005)
    { id: '126013009005001', name: 'Baliapasi', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 58, malePopulation: 148, femalePopulation: 151, totalPopulation: 299, census2011Population: 299, census2027Population: 431 },
    { id: '126013009005002', name: 'Bhikipur', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 159, malePopulation: 361, femalePopulation: 357, totalPopulation: 718, census2011Population: 718, census2027Population: 1034 },
    { id: '126013009005003', name: 'Krusha nanagarpatana', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 77, malePopulation: 199, femalePopulation: 184, totalPopulation: 383, census2011Population: 383, census2027Population: 552 },
    { id: '126013009005004', name: 'Krush naanagar', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 137, malePopulation: 336, femalePopulation: 322, totalPopulation: 658, census2011Population: 658, census2027Population: 948 },
    { id: '126013009005005', name: 'Laxminagar', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 526, malePopulation: 1312, femalePopulation: 1275, totalPopulation: 2587, census2011Population: 2587, census2027Population: 3725 },
    { id: '126013009005006', name: 'Radhanagar', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 162, malePopulation: 407, femalePopulation: 384, totalPopulation: 791, census2011Population: 791, census2027Population: 1139 },
    { id: '126013009005007', name: 'Tarapur', panchayatId: '126013009005', blockId: rasulpurBlockId, households: 183, malePopulation: 458, femalePopulation: 442, totalPopulation: 900, census2011Population: 900, census2027Population: 1296 },

    // Mugupal GP (126013009006)
    { id: '126013009006001', name: 'Baransa', panchayatId: '126013009006', blockId: rasulpurBlockId, households: 142, malePopulation: 382, femalePopulation: 360, totalPopulation: 742, census2011Population: 742, census2027Population: 1068 },
    { id: '126013009006002', name: 'Khaoirabada', panchayatId: '126013009006', blockId: rasulpurBlockId, households: 135, malePopulation: 339, femalePopulation: 363, totalPopulation: 702, census2011Population: 702, census2027Population: 1011 },
    { id: '126013009006003', name: 'Mugupal', panchayatId: '126013009006', blockId: rasulpurBlockId, households: 601, malePopulation: 1441, femalePopulation: 1389, totalPopulation: 2830, census2011Population: 2830, census2027Population: 4075 },
    { id: '126013009006004', name: 'Sarangapur', panchayatId: '126013009006', blockId: rasulpurBlockId, households: 227, malePopulation: 542, femalePopulation: 556, totalPopulation: 1098, census2011Population: 1098, census2027Population: 1581 },

    // Narasinghpur GP (126013009007)
    { id: '126013009007001', name: 'Bada govindapur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 72, malePopulation: 195, femalePopulation: 196, totalPopulation: 391, census2011Population: 391, census2027Population: 563 },
    { id: '126013009007002', name: 'Gholapur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 7, malePopulation: 16, femalePopulation: 19, totalPopulation: 35, census2011Population: 35, census2027Population: 50 },
    { id: '126013009007003', name: 'Goura shyamapatana', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 217, malePopulation: 480, femalePopulation: 468, totalPopulation: 948, census2011Population: 948, census2027Population: 1365 },
    { id: '126013009007004', name: 'Jitipur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 68, malePopulation: 164, femalePopulation: 134, totalPopulation: 298, census2011Population: 298, census2027Population: 429 },
    { id: '126013009007005', name: 'Haripur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 516, malePopulation: 1200, femalePopulation: 1122, totalPopulation: 2322, census2011Population: 2322, census2027Population: 3344 },
    { id: '126013009007006', name: 'Koruan', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 127, malePopulation: 302, femalePopulation: 261, totalPopulation: 563, census2011Population: 563, census2027Population: 811 },
    { id: '126013009007007', name: 'Narsinghpur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 482, malePopulation: 1321, femalePopulation: 1229, totalPopulation: 2550, census2011Population: 2550, census2027Population: 3672 },
    { id: '126013009007008', name: 'Nuamirzapur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 102, malePopulation: 270, femalePopulation: 238, totalPopulation: 508, census2011Population: 508, census2027Population: 732 },
    { id: '126013009007009', name: 'Sana govindapur', panchayatId: '126013009007', blockId: rasulpurBlockId, households: 87, malePopulation: 202, femalePopulation: 199, totalPopulation: 401, census2011Population: 401, census2027Population: 577 },

    // Pahanga GP (126013009008)
    { id: '126013009008001', name: 'Jokadia', panchayatId: '126013009008', blockId: rasulpurBlockId, households: 186, malePopulation: 414, femalePopulation: 379, totalPopulation: 793, census2011Population: 793, census2027Population: 1142 },
    { id: '126013009008002', name: 'Pahanga', panchayatId: '126013009008', blockId: rasulpurBlockId, households: 550, malePopulation: 1315, femalePopulation: 1278, totalPopulation: 2593, census2011Population: 2593, census2027Population: 3734 },
    { id: '126013009008003', name: 'Routrapur', panchayatId: '126013009008', blockId: rasulpurBlockId, households: 283, malePopulation: 710, femalePopulation: 685, totalPopulation: 1395, census2011Population: 1395, census2027Population: 2009 },

    // Tikarpada GP (126013009009)
    { id: '126013009009001', name: 'Kujibar', panchayatId: '126013009009', blockId: rasulpurBlockId, households: 273, malePopulation: 621, femalePopulation: 580, totalPopulation: 1201, census2011Population: 1201, census2027Population: 1729 },
    { id: '126013009009002', name: 'Tikarpada', panchayatId: '126013009009', blockId: rasulpurBlockId, households: 307, malePopulation: 776, femalePopulation: 763, totalPopulation: 1539, census2011Population: 1539, census2027Population: 2216 },

    // --- Korei Block Key Revenue Villages ---
    // Amrutia GP (126013008001)
    { id: '126013008001001', name: 'Amrutia', panchayatId: '126013008001', blockId: koreiBlockId, households: 450, malePopulation: 1105, femalePopulation: 1145, totalPopulation: 2250, census2011Population: 2250, census2027Population: 3240 },
    { id: '126013008001002', name: 'Banahar-I', panchayatId: '126013008001', blockId: koreiBlockId, households: 160, malePopulation: 372, femalePopulation: 355, totalPopulation: 727, census2011Population: 727, census2027Population: 1047 },
    { id: '126013008001003', name: 'Banahar-II', panchayatId: '126013008001', blockId: koreiBlockId, households: 145, malePopulation: 360, femalePopulation: 348, totalPopulation: 708, census2011Population: 708, census2027Population: 1020 },
    { id: '126013008001004', name: 'Rangaranga', panchayatId: '126013008001', blockId: koreiBlockId, households: 190, malePopulation: 417, femalePopulation: 414, totalPopulation: 831, census2011Population: 831, census2027Population: 1197 },
    { id: '126013008001005', name: 'Bagira', panchayatId: '126013008001', blockId: koreiBlockId, households: 240, malePopulation: 634, femalePopulation: 610, totalPopulation: 1244, census2011Population: 1244, census2027Population: 1791 },

    // Andhari GP (126013008002)
    { id: '126013008002001', name: 'Andhari', panchayatId: '126013008002', blockId: koreiBlockId, households: 380, malePopulation: 984, femalePopulation: 914, totalPopulation: 1898, census2011Population: 1898, census2027Population: 2733 },
    { id: '126013008002002', name: 'Korabandi', panchayatId: '126013008002', blockId: koreiBlockId, households: 320, malePopulation: 862, femalePopulation: 826, totalPopulation: 1688, census2011Population: 1688, census2027Population: 2431 },
    { id: '126013008002003', name: 'Ragadi', panchayatId: '126013008002', blockId: koreiBlockId, households: 290, malePopulation: 723, femalePopulation: 715, totalPopulation: 1438, census2011Population: 1438, census2027Population: 2071 },
    { id: '126013008002004', name: 'Kiapada', panchayatId: '126013008002', blockId: koreiBlockId, households: 85, malePopulation: 242, femalePopulation: 157, totalPopulation: 399, census2011Population: 399, census2027Population: 575 },

    // Bandalo GP (126013008006)
    { id: '126013008006001', name: 'Gahmaria', panchayatId: '126013008006', blockId: koreiBlockId, households: 390, malePopulation: 980, femalePopulation: 1040, totalPopulation: 2020, census2011Population: 2020, census2027Population: 2909 },
    { id: '126013008006002', name: 'Bandalo', panchayatId: '126013008006', blockId: koreiBlockId, households: 580, malePopulation: 1407, femalePopulation: 1580, totalPopulation: 2987, census2011Population: 2987, census2027Population: 4301 },

    // Barundei GP (126013008007)
    { id: '126013008007001', name: 'Barundei', panchayatId: '126013008007', blockId: koreiBlockId, households: 420, malePopulation: 1050, femalePopulation: 1040, totalPopulation: 2090, census2011Population: 2090, census2027Population: 3010 },
    { id: '126013008007002', name: 'Biruhanpada', panchayatId: '126013008007', blockId: koreiBlockId, households: 210, malePopulation: 520, femalePopulation: 515, totalPopulation: 1035, census2011Population: 1035, census2027Population: 1490 },
    { id: '126013008007003', name: 'Khajirinalua', panchayatId: '126013008007', blockId: koreiBlockId, households: 180, malePopulation: 450, femalePopulation: 440, totalPopulation: 890, census2011Population: 890, census2027Population: 1282 },
    { id: '126013008007004', name: 'Khajuribindha', panchayatId: '126013008007', blockId: koreiBlockId, households: 140, malePopulation: 360, femalePopulation: 363, totalPopulation: 723, census2011Population: 723, census2027Population: 1041 },

    // Panikoili GP (126013008022)
    { id: '126013008022001', name: 'Panikoili', panchayatId: '126013008022', blockId: koreiBlockId, households: 510, malePopulation: 1305, femalePopulation: 1279, totalPopulation: 2584, census2011Population: 2584, census2027Population: 3721 },
    { id: '126013008022002', name: 'Khajuripur', panchayatId: '126013008022', blockId: koreiBlockId, households: 280, malePopulation: 680, femalePopulation: 660, totalPopulation: 1340, census2011Population: 1340, census2027Population: 1930 },
    { id: '126013008022003', name: 'Koutara', panchayatId: '126013008022', blockId: koreiBlockId, households: 240, malePopulation: 590, femalePopulation: 560, totalPopulation: 1150, census2011Population: 1150, census2027Population: 1656 },
    { id: '126013008022004', name: 'Sanabarunipada', panchayatId: '126013008022', blockId: koreiBlockId, households: 195, malePopulation: 498, femalePopulation: 466, totalPopulation: 964, census2011Population: 964, census2027Population: 1388 },

    // Dhaneswar GP (126013008009)
    { id: '126013008009001', name: 'Dhaneswar', panchayatId: '126013008009', blockId: koreiBlockId, households: 620, malePopulation: 1513, femalePopulation: 1460, totalPopulation: 2973, census2011Population: 2973, census2027Population: 4281 },
    { id: '126013008009002', name: 'Mrutunjayapur', panchayatId: '126013008009', blockId: koreiBlockId, households: 340, malePopulation: 892, femalePopulation: 784, totalPopulation: 1676, census2011Population: 1676, census2027Population: 2413 },
    { id: '126013008009003', name: 'Badapatuli', panchayatId: '126013008009', blockId: koreiBlockId, households: 280, malePopulation: 710, femalePopulation: 690, totalPopulation: 1400, census2011Population: 1400, census2027Population: 2016 },
    { id: '126013008009004', name: 'Mohanpur', panchayatId: '126013008009', blockId: koreiBlockId, households: 220, malePopulation: 580, femalePopulation: 550, totalPopulation: 1130, census2011Population: 1130, census2027Population: 1627 },
    { id: '126013008009005', name: 'Aladajaleswarpur', panchayatId: '126013008009', blockId: koreiBlockId, households: 210, malePopulation: 551, femalePopulation: 537, totalPopulation: 1088, census2011Population: 1088, census2027Population: 1567 },

    // Jahna GP (126013008012)
    { id: '126013008012001', name: 'Jahna', panchayatId: '126013008012', blockId: koreiBlockId, households: 450, malePopulation: 1134, femalePopulation: 1055, totalPopulation: 2189, census2011Population: 2189, census2027Population: 3152 },
    { id: '126013008012002', name: 'Brahmanabad', panchayatId: '126013008012', blockId: koreiBlockId, households: 310, malePopulation: 820, femalePopulation: 790, totalPopulation: 1610, census2011Population: 1610, census2027Population: 2318 },
    { id: '126013008012003', name: 'Nahanda', panchayatId: '126013008012', blockId: koreiBlockId, households: 260, malePopulation: 680, femalePopulation: 650, totalPopulation: 1330, census2011Population: 1330, census2027Population: 1915 },
    { id: '126013008012004', name: 'Jalapapur', panchayatId: '126013008012', blockId: koreiBlockId, households: 210, malePopulation: 540, femalePopulation: 510, totalPopulation: 1050, census2011Population: 1050, census2027Population: 1512 },
    { id: '126013008012005', name: 'Nishankhapur', panchayatId: '126013008012', blockId: koreiBlockId, households: 150, malePopulation: 381, femalePopulation: 319, totalPopulation: 700, census2011Population: 700, census2027Population: 1008 },

    // Ranapur GP (126013008023)
    { id: '126013008023001', name: 'Ranapur', panchayatId: '126013008023', blockId: koreiBlockId, households: 240, malePopulation: 620, femalePopulation: 590, totalPopulation: 1210, census2011Population: 1210, census2027Population: 1742 },
    { id: '126013008023002', name: 'Gopalapur', panchayatId: '126013008023', blockId: koreiBlockId, households: 160, malePopulation: 410, femalePopulation: 390, totalPopulation: 800, census2011Population: 800, census2027Population: 1152 },
    { id: '126013008023003', name: 'Chingulipur', panchayatId: '126013008023', blockId: koreiBlockId, households: 150, malePopulation: 390, femalePopulation: 375, totalPopulation: 765, census2011Population: 765, census2027Population: 1102 },
    { id: '126013008023004', name: 'Mahulia', panchayatId: '126013008023', blockId: koreiBlockId, households: 120, malePopulation: 310, femalePopulation: 295, totalPopulation: 605, census2011Population: 605, census2027Population: 871 },
    { id: '126013008023005', name: 'Toranda', panchayatId: '126013008023', blockId: koreiBlockId, households: 110, malePopulation: 272, femalePopulation: 252, totalPopulation: 524, census2011Population: 524, census2027Population: 755 },
  ];

  const filteredVillages = seededRevenueVillages;

  // 5. Pre-seed all 26 Wards of Vyasnagar Municipality with Census 2011 & 2027 data
  const vyasnagarUlbId = '126013901';
  const vyasnagarWardsData = [
    { wardNumber: 1, name: 'Ward No. 01', male: 855, female: 755, census2011: 1610, census2027: 1272 },
    { wardNumber: 2, name: 'Ward No. 02', male: 767, female: 706, census2011: 1473, census2027: 1376 },
    { wardNumber: 3, name: 'Ward No. 03', male: 942, female: 910, census2011: 1852, census2027: 2447 },
    { wardNumber: 4, name: 'Ward No. 04', male: 1071, female: 1012, census2011: 2083, census2027: 2490 },
    { wardNumber: 5, name: 'Ward No. 05', male: 1193, female: 1027, census2011: 2220, census2027: 3228 },
    { wardNumber: 6, name: 'Ward No. 06', male: 500, female: 494, census2011: 994, census2027: 1863 },
    { wardNumber: 7, name: 'Ward No. 07', male: 853, female: 850, census2011: 1703, census2027: 2770 },
    { wardNumber: 8, name: 'Ward No. 08', male: 1043, female: 961, census2011: 2004, census2027: 4120 },
    { wardNumber: 9, name: 'Ward No. 09', male: 1457, female: 1290, census2011: 2747, census2027: 3793 },
    { wardNumber: 10, name: 'Ward No. 10', male: 1309, female: 1103, census2011: 2412, census2027: 4444 },
    { wardNumber: 11, name: 'Ward No. 11', male: 817, female: 763, census2011: 1580, census2027: 1414 },
    { wardNumber: 12, name: 'Ward No. 12', male: 1553, female: 1413, census2011: 2966, census2027: 3451 },
    { wardNumber: 13, name: 'Ward No. 13', male: 534, female: 464, census2011: 998, census2027: 1201 },
    { wardNumber: 14, name: 'Ward No. 14', male: 593, female: 556, census2011: 1149, census2027: 1884 },
    { wardNumber: 15, name: 'Ward No. 15', male: 1325, female: 1281, census2011: 2606, census2027: 3632 },
    { wardNumber: 16, name: 'Ward No. 16', male: 758, female: 730, census2011: 1488, census2027: 2912 },
    { wardNumber: 17, name: 'Ward No. 17', male: 1311, female: 1214, census2011: 2525, census2027: 4011 },
    { wardNumber: 18, name: 'Ward No. 18', male: 934, female: 920, census2011: 1854, census2027: 1682 },
    { wardNumber: 19, name: 'Ward No. 19', male: 735, female: 632, census2011: 1367, census2027: 1757 },
    { wardNumber: 20, name: 'Ward No. 20', male: 789, female: 750, census2011: 1539, census2027: 3413 },
    { wardNumber: 21, name: 'Ward No. 21', male: 947, female: 866, census2011: 1813, census2027: 3014 },
    { wardNumber: 22, name: 'Ward No. 22', male: 974, female: 962, census2011: 1936, census2027: 2026 },
    { wardNumber: 23, name: 'Ward No. 23', male: 1017, female: 944, census2011: 1961, census2027: 2412 },
    { wardNumber: 24, name: 'Ward No. 24', male: 968, female: 917, census2011: 1885, census2027: 2663 },
    { wardNumber: 25, name: 'Ward No. 25', male: 778, female: 783, census2011: 1561, census2027: 2028 },
    { wardNumber: 26, name: 'Ward No. 26', male: 1342, female: 1243, census2011: 2585, census2027: 3660 },
  ];

  const filteredWards: WardItem[] = vyasnagarWardsData.map((w) => ({
    id: `${vyasnagarUlbId}${String(w.wardNumber).padStart(3, '0')}`,
    name: w.name,
    wardNumber: w.wardNumber,
    parentType: 'ULB',
    parentId: vyasnagarUlbId,
    assemblyId: koreiAssemblyId,
    malePopulation: w.male,
    femalePopulation: w.female,
    census2011Population: w.census2011,
    census2027Population: w.census2027,
  }));

  // Also retain any rural wards under Korei/Rasulpur villages
  const allowedVillageIds = new Set(filteredVillages.map((v) => v.id));
  extractedWards
    .filter((w) => w.parentType === 'VILLAGE' && allowedVillageIds.has(w.parentId))
    .forEach((rw) => filteredWards.push(rw));

  // 6. Keep Booths linked to filtered Wards
  const allowedWardIds = new Set(filteredWards.map((w) => w.id));
  const filteredBooths = extractedBooths.filter(
    (b) => (b.wardId && allowedWardIds.has(b.wardId)) || (b.wardIds && b.wardIds.some((wid) => allowedWardIds.has(wid))),
  );

  return {
    districts: extractedDistricts,
    assemblies: extractedAssemblies,
    blocks: filteredBlocks,
    ulbs: filteredULBs,
    panchayats: filteredPanchayats,
    villages: filteredVillages,
    wards: filteredWards,
    booths: filteredBooths,
  };
}

const initialHierarchy = parseInitialHierarchy();

export const useHierarchyStore = create<HierarchyState>()(
  persist(
    (set, get) => ({
      states: initialStatesData as StateItem[],
      districts: initialHierarchy.districts,
      assemblyConstituencies: initialHierarchy.assemblies,
      blocks: initialHierarchy.blocks,
      urbanLocalBodies: initialHierarchy.ulbs,
      panchayats: initialHierarchy.panchayats,
      villages: initialHierarchy.villages,
      wards: initialHierarchy.wards,
      booths: initialHierarchy.booths,

      // District CRUD
      addDistrict: (district) => {
        const existingInState = get().districts.filter((d) => String(d.stateId) === String(district.stateId));
        const nextNum = existingInState.length + 1;
        const autoId = `${district.stateId}${String(nextNum).padStart(3, '0')}`;
        const newItem: DistrictItem = {
          ...district,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ districts: [newItem, ...state.districts] }));
        return newItem;
      },
      updateDistrict: (id, updates) => {
        set((state) => ({
          districts: state.districts.map((d) => (String(d.id) === String(id) ? { ...d, ...updates } : d)),
        }));
      },
      deleteDistrict: (id) => {
        const hasChildren =
          get().assemblyConstituencies.some((a) => String(a.districtId) === String(id)) ||
          get().blocks.some((b) => String(b.districtId) === String(id)) ||
          get().urbanLocalBodies.some((u) => String(u.districtId) === String(id));
        if (hasChildren) {
          return { success: false, error: 'Cannot delete district with associated constituencies or blocks.' };
        }
        set((state) => ({
          districts: state.districts.filter((d) => String(d.id) !== String(id)),
        }));
        return { success: true };
      },

      // Assembly Constituency CRUD
      addAssemblyConstituency: (ac) => {
        const existingInDistrict = get().assemblyConstituencies.filter((a) => String(a.districtId) === String(ac.districtId));
        const nextNum = existingInDistrict.length + 1;
        const autoId = `${ac.districtId}${String(nextNum).padStart(3, '0')}`;
        const newItem: AssemblyConstituencyItem = {
          ...ac,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ assemblyConstituencies: [newItem, ...state.assemblyConstituencies] }));
        return newItem;
      },
      updateAssemblyConstituency: (id, updates) => {
        set((state) => ({
          assemblyConstituencies: state.assemblyConstituencies.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        }));
      },
      deleteAssemblyConstituency: (id) => {
        set((state) => ({
          assemblyConstituencies: state.assemblyConstituencies.filter((item) => item.id !== id),
        }));
        return { success: true };
      },

      // Rural Block CRUD
      addBlock: (block) => {
        const existingInDistrict = get().blocks.filter((b) => String(b.districtId) === String(block.districtId));
        const nextNum = existingInDistrict.length + 1;
        const autoId = `${block.districtId}${String(nextNum).padStart(3, '0')}`;
        const newItem: BlockItem = {
          ...block,
          id: autoId,
          unitType: 'RURAL_BLOCK',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ blocks: [newItem, ...state.blocks] }));
        return newItem;
      },
      updateBlock: (id, updates) => {
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },
      deleteBlock: (id) => {
        const hasChildren = get().panchayats.some((p) => p.blockId === id);
        if (hasChildren) {
          return { success: false, error: 'Cannot delete block with associated Gram Panchayats.' };
        }
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        }));
        return { success: true };
      },

      // Urban Local Body CRUD
      addULB: (ulb) => {
        const existingInDistrict = get().urbanLocalBodies.filter((u) => String(u.districtId) === String(ulb.districtId));
        const nextNum = existingInDistrict.length + 1;
        const autoId = `${ulb.districtId}9${String(nextNum).padStart(2, '0')}`;
        const newItem: UrbanLocalBodyItem = {
          ...ulb,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ urbanLocalBodies: [newItem, ...state.urbanLocalBodies] }));
        return newItem;
      },
      updateULB: (id, updates) => {
        set((state) => ({
          urbanLocalBodies: state.urbanLocalBodies.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        }));
      },
      deleteULB: (id) => {
        const hasChildren = get().wards.some((w) => w.parentType === 'ULB' && w.parentId === id);
        if (hasChildren) {
          return { success: false, error: 'Cannot delete Urban Local Body with associated Municipal Wards.' };
        }
        set((state) => ({
          urbanLocalBodies: state.urbanLocalBodies.filter((u) => u.id !== id),
        }));
        return { success: true };
      },

      // Gram Panchayat CRUD
      addPanchayat: (panchayat) => {
        const existingInBlock = get().panchayats.filter((p) => p.blockId === panchayat.blockId);
        const nextNum = existingInBlock.length + 1;
        const autoId = `${panchayat.blockId}${String(nextNum).padStart(3, '0')}`;
        const newItem: PanchayatItem = {
          ...panchayat,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ panchayats: [newItem, ...state.panchayats] }));
        return newItem;
      },
      updatePanchayat: (id, updates) => {
        set((state) => ({
          panchayats: state.panchayats.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deletePanchayat: (id) => {
        const hasChildren = get().villages.some((v) => v.panchayatId === id);
        if (hasChildren) {
          return { success: false, error: 'Cannot delete Gram Panchayat with associated Villages.' };
        }
        set((state) => ({
          panchayats: state.panchayats.filter((p) => p.id !== id),
        }));
        return { success: true };
      },

      // Village CRUD
      addVillage: (village) => {
        const existingInGP = get().villages.filter((v) => v.panchayatId === village.panchayatId);
        const nextNum = existingInGP.length + 1;
        const autoId = `${village.panchayatId}${String(nextNum).padStart(3, '0')}`;
        const newItem: VillageItem = {
          ...village,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ villages: [newItem, ...state.villages] }));
        return newItem;
      },
      updateVillage: (id, updates) => {
        set((state) => ({
          villages: state.villages.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        }));
      },
      deleteVillage: (id) => {
        const hasChildren = get().wards.some((w) => w.parentType === 'VILLAGE' && w.parentId === id);
        if (hasChildren) {
          return { success: false, error: 'Cannot delete Village with associated Polling Wards.' };
        }
        set((state) => ({
          villages: state.villages.filter((v) => v.id !== id),
        }));
        return { success: true };
      },

      // Ward CRUD (Rural & Urban)
      addWard: (ward) => {
        const existingInParent = get().wards.filter((w) => w.parentId === ward.parentId);
        const nextNum = existingInParent.length + 1;
        const autoId = `${ward.parentId}${String(nextNum).padStart(3, '0')}`;
        const newItem: WardItem = {
          ...ward,
          id: autoId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ wards: [newItem, ...state.wards] }));
        return newItem;
      },
      updateWard: (id, updates) => {
        set((state) => ({
          wards: state.wards.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },
      deleteWard: (id) => {
        const hasChildren = get().booths.some((b) => b.wardId === id || (b.wardIds && b.wardIds.includes(id)));
        if (hasChildren) {
          return { success: false, error: 'Cannot delete Polling Ward with associated Polling Booths.' };
        }
        set((state) => ({
          wards: state.wards.filter((w) => w.id !== id),
        }));
        return { success: true };
      },

      // Polling Booth CRUD (Multi-Ward Support: 1 or more wards make a booth)
      addBooth: (booth) => {
        const primaryWardId = booth.wardId || (booth.wardIds && booth.wardIds[0]) || 'bth';
        const existingInWard = get().booths.filter((b) => b.wardId === primaryWardId || (b.wardIds && b.wardIds.includes(primaryWardId)));
        const nextNum = existingInWard.length + 1;
        const autoId = `${primaryWardId}${String(nextNum).padStart(3, '0')}`;
        const newItem: BoothItem = {
          ...booth,
          id: autoId,
          wardId: primaryWardId,
          wardIds: booth.wardIds && booth.wardIds.length > 0 ? booth.wardIds : (booth.wardId ? [booth.wardId] : []),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ booths: [newItem, ...state.booths] }));
        return newItem;
      },
      updateBooth: (id, updates) => {
        set((state) => ({
          booths: state.booths.map((b) => {
            if (b.id === id) {
              const updated = { ...b, ...updates };
              if (updates.wardIds && updates.wardIds.length > 0 && !updates.wardId) {
                updated.wardId = updates.wardIds[0];
              }
              return updated;
            }
            return b;
          }),
        }));
      },
      deleteBooth: (id) => {
        set((state) => ({
          booths: state.booths.filter((b) => b.id !== id),
        }));
        return { success: true };
      },

      // Helper selectors
      getDistrictsByState: (stateId) => {
        return get().districts.filter((d) => String(d.stateId) === String(stateId));
      },
      getAssembliesByDistrict: (districtId) => {
        return get().assemblyConstituencies.filter((a) => String(a.districtId) === String(districtId));
      },
      getBlocksByDistrict: (districtId) => {
        return get().blocks.filter((b) => String(b.districtId) === String(districtId));
      },
      getBlocksByAssembly: (assemblyId) => {
        return get().blocks.filter((b) => b.assemblyId === assemblyId);
      },
      getULBsByDistrict: (districtId) => {
        return get().urbanLocalBodies.filter((u) => String(u.districtId) === String(districtId));
      },
      getULBsByAssembly: (assemblyId) => {
        if (assemblyId) {
          return get().urbanLocalBodies.filter((u) => u.assemblyId === assemblyId);
        }
        return get().urbanLocalBodies;
      },
      getPanchayatsByBlock: (blockId) => {
        return get().panchayats.filter((p) => p.blockId === blockId);
      },
      getVillagesByPanchayat: (panchayatId) => {
        return get().villages.filter((v) => v.panchayatId === panchayatId);
      },
      getWardsByVillage: (villageId) => {
        return get().wards.filter((w) => w.parentType === 'VILLAGE' && w.parentId === villageId);
      },
      getWardsByULB: (ulbId) => {
        return get().wards.filter((w) => w.parentType === 'ULB' && w.parentId === ulbId);
      },
      getBoothsByWard: (wardId) => {
        return get().booths.filter((b) => b.wardId === wardId || (b.wardIds && b.wardIds.includes(wardId)));
      },
      getWardsByBooth: (boothId) => {
        const targetBooth = get().booths.find((b) => b.id === boothId);
        if (!targetBooth) return [];
        const wardIdList = targetBooth.wardIds || (targetBooth.wardId ? [targetBooth.wardId] : []);
        return get().wards.filter((w) => wardIdList.includes(w.id));
      },
    }),
    {
      name: 'mla_hierarchy_store_v25',
      storage: createJSONStorage(() => localStorage),
      // `states` is the full nested India dataset from the bundled JSON and is never
      // mutated, so keeping it out of storage avoids re-serializing it on every write.
      partialize: ({ states, ...rest }) => rest as HierarchyState,
    },
  ),
);
