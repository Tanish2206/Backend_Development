 const prisma = require('../utility/prismaClient');
const { uploadMedia } = require('../utility/AWSUtils');

const getDesignIdFromResponse = (designResponse) => {
  return designResponse.id; // Assuming the project ID is available as 'id' in the response.
};

exports.addDesign = async (req, res, next) => {
  try {
    const {
      title,
      description,
      isFree,
      amount,
      plotArea,
      numberOfFloors,
      facing,
      bedrooms,
      bathrooms,
      length,
      width,
      balcony,
      kitchens,
      livingrooms,
      dinningrooms,
      garageCapacity,
      constructionYear,
      vastu,
      unitType,
      designCategory,
      designType,
      propertyCategory,
      propertyType,
      masterBedroom,
      guestRooms,
      kidsRooms,
      drawingHall,
      toilets,
      temple         ,
      storeRooms     ,
      washArea       ,
      gardens        ,
      porche         ,
      swimmingPools  ,
      bars           ,
      lifts          ,
      shopType ,
      shops  ,
      flats,
      parkings         ,
      marriageHalls     ,
      restaurants       ,
      areto    ,
      classrooms        ,
      officeCabins         ,
      sportsGrounds     ,
      laboratory       ,
      library    ,
      auditorium        ,
      conferenceRooms         ,
      halls     ,
      serverRooms       ,
      stairs    ,
      beds        ,
      doctorCabins         ,
      OPD     ,
      genWard       ,
      emergencyWard    ,
      seatingCapacity        ,
      rooms         ,
      gatheringAreas     ,
      activityArea       ,
      numberOfSeats    ,
      screens        ,
      cafes         ,
      banquetHalls     ,
      sportsArea       ,
      spa    ,
      medical        ,
      theater         ,
      conferenceHalls     ,
      machineAreas       ,
      cardioArea    ,
      weightArea        ,
      indoorArea         ,
      outdoorArea     ,
      gardenArea       ,
    } = req.body;

    const plotAreaCount = isNaN(parseFloat(plotArea)) ? null : parseFloat(plotArea);
    const numberOfFloorsCount = isNaN(parseInt(numberOfFloors)) ? null : parseInt(numberOfFloors);
    const bedroomCount = isNaN(parseInt(bedrooms)) ? null : parseInt(bedrooms);
    const bathroomCount = isNaN(parseInt(bathrooms)) ? null : parseInt(bathrooms);
    const balconyCount = isNaN(parseInt(balcony)) ? null : parseInt(balcony);
    const kitchenCount = isNaN(parseInt(kitchens)) ? null : parseInt(kitchens);
    const lengthCount = isNaN(parseInt(length)) ? null : parseInt(length);
    const widthCount = isNaN(parseInt(width)) ? null : parseInt(width);
    const amountCount = isNaN(parseInt(amount)) ? null : parseInt(amount);
    const livingroomCount = isNaN(parseInt(livingrooms)) ? null : parseInt(livingrooms);
    const dinningroomCount = isNaN(parseInt(dinningrooms)) ? null : parseInt(dinningrooms);
    const garageCapacityCount = isNaN(parseInt(garageCapacity)) ? null : parseInt(garageCapacity);
    const constructionYearCount = isNaN(parseInt(constructionYear)) ? null : parseInt(constructionYear);

    const masterBedroomCount = isNaN(parseInt(masterBedroom)) ? null : parseInt(masterBedroom);
    const guestRoomsCount = isNaN(parseInt(guestRooms)) ? null : parseInt(guestRooms);
    const kidsRoomsCount = isNaN(parseInt(kidsRooms)) ? null : parseInt(kidsRooms);
    const drawingHallCount = isNaN(parseInt(drawingHall)) ? null : parseInt(drawingHall);
    const toiletsCount = isNaN(parseInt(toilets)) ? null : parseInt(toilets);
    const templeCount = isNaN(parseInt(temple)) ? null : parseInt(temple);
    const storeRoomsCount = isNaN(parseInt(storeRooms)) ? null : parseInt(storeRooms);
    const washAreaCount = isNaN(parseInt(washArea)) ? null : parseInt(washArea);
    const gardensCount = isNaN(parseInt(gardens)) ? null : parseInt(gardens);
    const porcheCount = isNaN(parseInt(porche)) ? null : parseInt(porche);
    const swimmingPoolsCount = isNaN(parseInt(swimmingPools)) ? null : parseInt(swimmingPools);
    const barsCount = isNaN(parseInt(bars)) ? null : parseInt(bars);
    const liftsCount = isNaN(parseInt(lifts)) ? null : parseInt(lifts);
    const shopsCount = isNaN(parseInt(shops)) ? null : parseInt(shops);
    const flatsCount = isNaN(parseInt(flats)) ? null : parseInt(flats);
    const parkingsCount = isNaN(parseInt(parkings)) ? null : parseInt(parkings);
    const marriageHallsCount = isNaN(parseInt(marriageHalls)) ? null : parseInt(marriageHalls);
    const restaurantsCount = isNaN(parseInt(restaurants)) ? null : parseInt(restaurants);
    const aretoCount = isNaN(parseInt(areto)) ? null : parseInt(areto);
    const classroomsCount = isNaN(parseInt(classrooms)) ? null : parseInt(classrooms);
    const officeCabinsCount = isNaN(parseInt(officeCabins)) ? null : parseInt(officeCabins);
    const sportsGroundsCount = isNaN(parseInt(sportsGrounds)) ? null : parseInt(sportsGrounds);
    const laboratoryCount = isNaN(parseInt(laboratory)) ? null : parseInt(laboratory);
    const libraryCount = isNaN(parseInt(library)) ? null : parseInt(library);
    const auditoriumCount = isNaN(parseInt(auditorium)) ? null : parseInt(auditorium);
    const conferenceRoomsCount = isNaN(parseInt(conferenceRooms)) ? null : parseInt(conferenceRooms);
    const hallsCount = isNaN(parseInt(halls)) ? null : parseInt(halls);
    const serverRoomsCount = isNaN(parseInt(serverRooms)) ? null : parseInt(serverRooms);
    const stairsCount = isNaN(parseInt(stairs)) ? null : parseInt(stairs);
    const bedsCount = isNaN(parseInt(beds)) ? null : parseInt(beds);
    const doctorCabinsCount = isNaN(parseInt(doctorCabins)) ? null : parseInt(doctorCabins);
    const OPDCount = isNaN(parseInt(OPD)) ? null : parseInt(OPD);
    const genWardCount = isNaN(parseInt(genWard)) ? null : parseInt(genWard);
    const emergencyWardCount = isNaN(parseInt(emergencyWard)) ? null : parseInt(emergencyWard);
    const seatingCapacityCount = isNaN(parseInt(seatingCapacity)) ? null : parseInt(seatingCapacity);
    const roomsCount = isNaN(parseInt(rooms)) ? null : parseInt(rooms);
    const gatheringAreasCount = isNaN(parseInt(gatheringAreas)) ? null : parseInt(gatheringAreas);
    const activityAreaCount = isNaN(parseInt(activityArea)) ? null : parseInt(activityArea);
    const numberOfSeatsCount = isNaN(parseInt(numberOfSeats)) ? null : parseInt(numberOfSeats);
    const screensCount = isNaN(parseInt(screens)) ? null : parseInt(screens);
    const cafesCount = isNaN(parseInt(cafes)) ? null : parseInt(cafes);
    const banquetHallsCount = isNaN(parseInt(banquetHalls)) ? null : parseInt(banquetHalls);
    const sportsAreaCount = isNaN(parseInt(sportsArea)) ? null : parseInt(sportsArea);
    const spaCount = isNaN(parseInt(spa)) ? null : parseInt(spa);
    const medicalCount = isNaN(parseInt(medical)) ? null : parseInt(medical);
    const theaterCount = isNaN(parseInt(theater)) ? null : parseInt(theater);
    const conferenceHallsCount = isNaN(parseInt(conferenceHalls)) ? null : parseInt(conferenceHalls);
    const machineAreasCount = isNaN(parseInt(machineAreas)) ? null : parseInt(machineAreas);
    const cardioAreaCount = isNaN(parseInt(cardioArea)) ? null : parseInt(cardioArea);
    const weightAreaCount = isNaN(parseInt(weightArea)) ? null : parseInt(weightArea);
    const indoorAreaCount = isNaN(parseInt(indoorArea)) ? null : parseInt(indoorArea);
    const outdoorAreaCount = isNaN(parseInt(outdoorArea)) ? null : parseInt(outdoorArea);
    const gardenAreaCount = isNaN(parseInt(gardenArea)) ? null : parseInt(gardenArea);


    const designImages = Array.isArray(req.files?.designImagesUrls)
      ? req.files.designImagesUrls
      : req.files?.designImagesUrls
      ? [req.files.designImagesUrls]
      : [];

    const videos = Array.isArray(req.files?.videosUrls)
      ? req.files.videosUrls
      : req.files?.videosUrls
      ? [req.files.videosUrls]
      : [];

    const media = [];

    const designDetail = await prisma.designDetail.create({
      data: {
        designCategory,
        designType,
      },
    });

    const propertyDetail = await prisma.propertyDetail.create({
      data: {
        propertyCategory,
        propertyType,
        shopType,
        masterBedroom: masterBedroomCount,
        guestRooms: guestRoomsCount,
        kidsRooms: kidsRoomsCount,
        drawingHall: drawingHallCount,
        toilets: toiletsCount,
        temple: templeCount,
        storeRooms: storeRoomsCount,
        washArea: washAreaCount,
        gardens: gardensCount,
        porche: porcheCount,
        swimmingPools: swimmingPoolsCount,
        bars: barsCount,
        lifts: liftsCount,
        shops: shopsCount,
        flats: flatsCount,
        parkings: parkingsCount,
        marriageHalls: marriageHallsCount,
        restaurants: restaurantsCount,
        areto: aretoCount,
        classrooms: classroomsCount,
        officeCabins: officeCabinsCount,
        sportsGrounds: sportsGroundsCount,
        laboratory: laboratoryCount,
        library: libraryCount,
        auditorium: auditoriumCount,
        conferenceRooms: conferenceRoomsCount,
        halls: hallsCount,
        serverRooms: serverRoomsCount,
        stairs: stairsCount,
        beds: bedsCount,
        doctorCabins: doctorCabinsCount,
        OPD: OPDCount,
        genWard: genWardCount,
        emergencyWard: emergencyWardCount,
        seatingCapacity: seatingCapacityCount,
        rooms: roomsCount,
        gatheringAreas: gatheringAreasCount,
        activityArea: activityAreaCount,
        numberOfSeats: numberOfSeatsCount,
        screens: screensCount,
        cafes: cafesCount,
        banquetHalls: banquetHallsCount,
        sportsArea: sportsAreaCount,
        spa: spaCount,
        medical: medicalCount,
        theater: theaterCount,
        conferenceHalls: conferenceHallsCount,
        machineAreas: machineAreasCount,
        cardioArea: cardioAreaCount,
        weightArea: weightAreaCount,
        indoorArea: indoorAreaCount,
        outdoorArea: outdoorAreaCount,
        gardenArea: gardenAreaCount
      },
    });

    const design = await prisma.design.create({
      data: {
        title,
        description,
        isFree: isFree === 'true',
        amount: amountCount,
        plotArea: plotAreaCount,
        numberOfFloors: numberOfFloorsCount,
        facing,
        length: lengthCount,
        width: widthCount,
        bedrooms: bedroomCount,
        bathrooms: bathroomCount,
        balcony: balconyCount,
        kitchens: kitchenCount,
        livingrooms: livingroomCount,
        dinningrooms: dinningroomCount,
        garageCapacity: garageCapacityCount,
        constructionYear: constructionYearCount,
        vastu: Boolean(vastu),
        unitType,
        designDetail: {
          connect: { id: designDetail.id },
        },
        propertyDetail: {
          connect: { id: propertyDetail.id },
        },
        designMedia: {
          create: media,
        },
      },
    });

    const designId = getDesignIdFromResponse(design);
    const folder = `Designs/Design ${designId}/`;

    let designImagesUrls = [];
    if (designImages?.length > 0) {
      designImagesUrls = await Promise.all(designImages.map((file) => uploadMedia(file, folder)));
      designImagesUrls.forEach((url) => {
        media.push({ link: url, mediaType: 'Image' });
      });
    }

    let videosUrls = [];
    if (videos?.length > 0) {
      videosUrls = await Promise.all(videos.map((file) => uploadMedia(file, folder)));
      videosUrls.forEach((url) => {
        media.push({ link: url, mediaType: 'Video' });
      });
    }

    const createdMedia = await prisma.designMedia.createMany({
      data: media.map((item) => ({
        designId: design.id,
        ...item,
      })),
    });

    const response = {
      designImagesUrls,
      videosUrls,
      
        ...design,
        propertyCategory,
        propertyType,
        shopType,
        masterBedroom: masterBedroomCount,
        guestRooms: guestRoomsCount,
        kidsRooms: kidsRoomsCount,
        drawingHall: drawingHallCount,
        toilets: toiletsCount,
        temple: templeCount,
        storeRooms: storeRoomsCount,
        washArea: washAreaCount,
        gardens: gardensCount,
        porche: porcheCount,
        swimmingPools: swimmingPoolsCount,
        bars: barsCount,
        lifts: liftsCount,
        shops: shopsCount,
        flats: flatsCount,
        parkings: parkingsCount,
        marriageHalls: marriageHallsCount,
        restaurants: restaurantsCount,
        areto: aretoCount,
        classrooms: classroomsCount,
        officeCabins: officeCabinsCount,
        sportsGrounds: sportsGroundsCount,
        laboratory: laboratoryCount,
        library: libraryCount,
        auditorium: auditoriumCount,
        conferenceRooms: conferenceRoomsCount,
        halls: hallsCount,
        serverRooms: serverRoomsCount,
        stairs: stairsCount,
        beds: bedsCount,
        doctorCabins: doctorCabinsCount,
        OPD: OPDCount,
        genWard: genWardCount,
        emergencyWard: emergencyWardCount,
        seatingCapacity: seatingCapacityCount,
        rooms: roomsCount,
        gatheringAreas: gatheringAreasCount,
        activityArea: activityAreaCount,
        numberOfSeats: numberOfSeatsCount,
        screens: screensCount,
        cafes: cafesCount,
        banquetHalls: banquetHallsCount,
        sportsArea: sportsAreaCount,
        spa: spaCount,
        medical: medicalCount,
        theater: theaterCount,
        conferenceHalls: conferenceHallsCount,
        machineAreas: machineAreasCount,
        cardioArea: cardioAreaCount,
        weightArea: weightAreaCount,
        indoorArea: indoorAreaCount,
        outdoorArea: outdoorAreaCount,
        gardenArea: gardenAreaCount,
        designCategory,
        designType,
      
    };

    for (const key in response) {
      if (response[key] === null) {
        delete response[key];
      }
    }

    res.status(200).json({
      ...response,
      designImagesUrls: response.designImagesUrls,
      videosUrls: response.videosUrls,
    });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const extractUserIds = (transactionOrder) => {
  if (Array.isArray(transactionOrder)) {
    return [...new Set(transactionOrder.map((order) => order.user?.id).filter(Boolean))];
  } else if (transactionOrder && transactionOrder.user) {
    return [transactionOrder.user.id];
  }
  return [];
};

exports.getDesigns = async (req, res, next) => {
  try {
    const {
      id,
      isFree,
      designCategory,
      designType,
      propertyCategory,
      propertyType,
      vastu,
      facing,
      length,
      width,
      unitType,
      bedrooms,
      bathrooms,
      constructionYear,
      kitchens,
      amount,
      plotArea,
      numberOfFloors,
      balcony,
      livingrooms,
      dinningrooms,
      garageCapacity,
      title,
      description,

      masterBedroom,
      guestRooms,
      kidsRooms,
      drawingHall,
      toilets,
      temple         ,
      storeRooms     ,
      washArea       ,
      gardens        ,
      porche         ,
      swimmingPools  ,
      bars           ,
      lifts          ,
      shopType ,
      shops  ,
      flats,
      parkings         ,
      marriageHalls     ,
      restaurants       ,
      areto    ,
      classrooms        ,
      officeCabins         ,
      sportsGrounds     ,
      laboratory       ,
      library    ,
      auditorium        ,
      conferenceRooms         ,
      halls     ,
      serverRooms       ,
      stairs    ,
      beds        ,
      doctorCabins         ,
      OPD     ,
      genWard       ,
      emergencyWard    ,
      seatingCapacity        ,
      rooms         ,
      gatheringAreas     ,
      activityArea       ,
      numberOfSeats    ,
      screens        ,
      cafes         ,
      banquetHalls     ,
      sportsArea       ,
      spa    ,
      medical        ,
      theater         ,
      conferenceHalls     ,
      machineAreas       ,
      cardioArea    ,
      weightArea        ,
      indoorArea         ,
      outdoorArea     ,
      gardenArea       ,
    } = req.body;

    let whereCondition = {};

    // Add conditions from body
    if (id) {
      whereCondition.id = parseInt(id);
    }
    if (isFree !== undefined) {
      whereCondition.isFree = Boolean(isFree);
    }
    if (designCategory || designType) {
      whereCondition.designDetail = {};
      if (designCategory) {
        whereCondition.designDetail.designCategory = designCategory;
      }
      if (designType) {
        whereCondition.designDetail.designType = designType;
      }
    }
    if (propertyCategory || propertyType) {
      whereCondition.propertyDetail = {};
      if (propertyCategory) {
        whereCondition.propertyDetail.propertyCategory = propertyCategory;
      }
      if (propertyType) {
        whereCondition.propertyDetail.propertyType = propertyType;
      }
    }
    if (vastu !== undefined) {
      whereCondition.vastu = Boolean(vastu);
    }
    if (facing) {
      whereCondition.facing = facing;
    }
    if (title) {
      whereCondition.title = title;
    }
    if (description) {
      whereCondition.description = description;
    }
    if (length) {
      whereCondition.length = parseInt(length);
    }
    if (width) {
      whereCondition.width = parseInt(width);
    }
    if (amount) {
      whereCondition.amount = parseInt(amount);
    }
    if (plotArea) {
      whereCondition.plotArea = parseInt(plotArea);
    }
    if (numberOfFloors) {
      whereCondition.numberOfFloors = parseInt(numberOfFloors);
    }
    if (bedrooms) {
      whereCondition.bedrooms = parseInt(bedrooms);
    }
    if (bathrooms) {
      whereCondition.bathrooms = parseInt(bathrooms);
    }
    if (balcony) {
      whereCondition.balcony = parseInt(balcony);
    }
    if (livingrooms) {
      whereCondition.livingrooms = parseInt(livingrooms);
    }
    if (kitchens) {
      whereCondition.kitchens = parseInt(kitchens);
    }
    if (dinningrooms) {
      whereCondition.dinningrooms = parseInt(dinningrooms);
    }
    if (garageCapacity) {
      whereCondition.garageCapacity = parseInt(garageCapacity);
    }
    if (constructionYear) {
      whereCondition.constructionYear = parseInt(constructionYear);
    }
    if (unitType) {
      whereCondition.unitType = unitType;
    }
    if (masterBedroom) {
      whereCondition.masterBedroom = parseInt(masterBedroom);
  }
  
  if (guestRooms) {
      whereCondition.guestRooms = parseInt(guestRooms);
  }
  
  if (kidsRooms) {
      whereCondition.kidsRooms = parseInt(kidsRooms);
  }
  
  if (drawingHall) {
      whereCondition.drawingHall = parseInt(drawingHall);
  }
  
  if (toilets) {
      whereCondition.toilets = parseInt(toilets);
  }
  
  if (temple) {
      whereCondition.temple = parseInt(temple);
  }
  
  if (storeRooms) {
      whereCondition.storeRooms = parseInt(storeRooms);
  }
  
  if (washArea) {
      whereCondition.washArea = parseInt(washArea);
  }
  
  if (gardens) {
      whereCondition.gardens = parseInt(gardens);
  }
  
  if (porche) {
      whereCondition.porche = parseInt(porche);
  }
  
  if (swimmingPools) {
      whereCondition.swimmingPools = parseInt(swimmingPools);
  }
  
  if (bars) {
      whereCondition.bars = parseInt(bars);
  }
  
  if (lifts) {
      whereCondition.lifts = parseInt(lifts);
  }
  
  if (shopType) {
    whereCondition.shopType = shopType;
  }

  if (shops) {
    whereCondition.shops = parseInt(shops);
  }

  if (flats) {
    whereCondition.flats = parseInt(flats);
}

if (parkings) {
    whereCondition.parkings = parseInt(parkings);
}

if (marriageHalls) {
    whereCondition.marriageHalls = parseInt(marriageHalls);
}

if (restaurants) {
    whereCondition.restaurants = parseInt(restaurants);
}

if (areto) {
    whereCondition.areto = parseInt(areto);
}

if (classrooms) {
    whereCondition.classrooms = parseInt(classrooms);
}

if (officeCabins) {
    whereCondition.officeCabins = parseInt(officeCabins);
}

if (sportsGrounds) {
    whereCondition.sportsGrounds = parseInt(sportsGrounds);
}

if (laboratory) {
    whereCondition.laboratory = parseInt(laboratory);
}

if (library) {
    whereCondition.library = parseInt(library);
}

if (auditorium) {
    whereCondition.auditorium = parseInt(auditorium);
}

if (conferenceRooms) {
    whereCondition.conferenceRooms = parseInt(conferenceRooms);
}

if (halls) {
    whereCondition.halls = parseInt(halls);
}

if (serverRooms) {
    whereCondition.serverRooms = parseInt(serverRooms);
}

if (stairs) {
    whereCondition.stairs = parseInt(stairs);
}

if (beds) {
    whereCondition.beds = parseInt(beds);
}

if (doctorCabins) {
    whereCondition.doctorCabins = parseInt(doctorCabins);
}

if (OPD) {
    whereCondition.OPD = parseInt(OPD);
}

if (genWard) {
    whereCondition.genWard = parseInt(genWard);
}

if (emergencyWard) {
    whereCondition.emergencyWard = parseInt(emergencyWard);
}

if (seatingCapacity) {
    whereCondition.seatingCapacity = parseInt(seatingCapacity);
}

if (rooms) {
    whereCondition.rooms = parseInt(rooms);
}

if (gatheringAreas) {
    whereCondition.gatheringAreas = parseInt(gatheringAreas);
}

if (activityArea) {
    whereCondition.activityArea = parseInt(activityArea);
}

if (numberOfSeats) {
    whereCondition.numberOfSeats = parseInt(numberOfSeats);
}

if (screens) {
    whereCondition.screens = parseInt(screens);
}

if (cafes) {
    whereCondition.cafes = parseInt(cafes);
}

if (banquetHalls) {
    whereCondition.banquetHalls = parseInt(banquetHalls);
}

if (sportsArea) {
    whereCondition.sportsArea = parseInt(sportsArea);
}

if (spa) {
    whereCondition.spa = parseInt(spa);
}

if (medical) {
    whereCondition.medical = parseInt(medical);
}

if (theater) {
    whereCondition.theater = parseInt(theater);
}

if (conferenceHalls) {
    whereCondition.conferenceHalls = parseInt(conferenceHalls);
}

if (machineAreas) {
    whereCondition.machineAreas = parseInt(machineAreas);
}

if (cardioArea) {
    whereCondition.cardioArea = parseInt(cardioArea);
}

if (weightArea) {
    whereCondition.weightArea = parseInt(weightArea);
}

if (indoorArea) {
    whereCondition.indoorArea = parseInt(indoorArea);
}

if (outdoorArea) {
    whereCondition.outdoorArea = parseInt(outdoorArea);
}

if (gardenArea) {
    whereCondition.gardenArea = parseInt(gardenArea);
}

    const designs = await prisma.design.findMany({
      where: whereCondition,
      include: {
        designDetail: true,
        propertyDetail: true,
        designMedia: true,
        transactionOrder: { // Include the related TransactionOrder
          include: {
            user: true, // Include the related User
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const filteredResponseData = designs.map((design) => {
      const uniqueDesignImagesUrls = new Set(
        design.designMedia
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link)
      );
      const uniqueVideosUrls = new Set(
        design.designMedia
          .filter((media) => media.mediaType === 'Video')
          .map((media) => media.link)
      );

      const transactionOrders = design.transactionOrder;

      const userId = design.transactionOrder?.user?.id || null;

      const designResponse = {
        id: design.id,
        title: design.title,
        description: design.description,
        designDetailId: design.designDetail.id,
        propertyDetailId: design.propertyDetail.id,
        isFree: design.isFree,
        amount: design.amount,
        length: design.length,
        width: design.width,
        plotArea: design.plotArea,
        numberOfFloors: design.numberOfFloors,
        facing: design.facing,
        bedrooms: design.bedrooms,
        bathrooms: design.bathrooms,
        balcony: design.balcony,
        kitchens: design.kitchens,
        livingrooms: design.livingrooms,
        dinningrooms: design.dinningrooms,
        garageCapacity: design.garageCapacity,
        constructionYear: design.constructionYear,
        vastu: design.vastu,
        unitType: design.unitType,
        transactionOrderId: transactionOrders?.id || null,
        userId: userId,
        designImagesUrls: Array.from(uniqueDesignImagesUrls),
        videosUrls: Array.from(uniqueVideosUrls),
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        designCategory: design.designDetail.designCategory,
        designType: design.designDetail.designType,
        propertyCategory: design.propertyDetail.propertyCategory,
        propertyType: design.propertyDetail.propertyType,
      };

      for (const key in design.propertyDetail) {
        if (design.propertyDetail[key] !== null) {
          designResponse[key] = design.propertyDetail[key];
        }
      }

      return designResponse ;
    });

    res.send({
      response_code: 200,
      response_message: 'Success',
      response_data: filteredResponseData,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({
      response_code: 500,
      response_message: 'Error',
      response_data: err.message,
    });
  }
};

exports.updateDesign = async (req, res, next) => {
  try {
    const { id } = req.query;
    const {
      title,
      description,
      isFree,
      amount,
      length,
      width,
      plotArea,
      numberOfFloors,
      facing,
      bedrooms,
      bathrooms,
      balcony,
      kitchens,
      livingrooms,
      dinningrooms,
      garageCapacity,
      constructionYear,
      vastu,
      unitType,
      designCategory, // New field
      designType,     // New field
      propertyCategory, // New field
      propertyType,    // New field
      masterBedroom,
      guestRooms,
      kidsRooms,
      drawingHall,
      toilets,
      temple         ,
      storeRooms     ,
      washArea       ,
      gardens        ,
      porche         ,
      swimmingPools  ,
      bars           ,
      lifts          ,
      shopType ,
      shops  ,
      flats,
      parkings         ,
      marriageHalls     ,
      restaurants       ,
      areto    ,
      classrooms        ,
      officeCabins         ,
      sportsGrounds     ,
      laboratory       ,
      library    ,
      auditorium        ,
      conferenceRooms         ,
      halls     ,
      serverRooms       ,
      stairs    ,
      beds        ,
      doctorCabins         ,
      OPD     ,
      genWard       ,
      emergencyWard    ,
      seatingCapacity        ,
      rooms         ,
      gatheringAreas     ,
      activityArea       ,
      numberOfSeats    ,
      screens        ,
      cafes         ,
      banquetHalls     ,
      sportsArea       ,
      spa    ,
      medical        ,
      theater         ,
      conferenceHalls     ,
      machineAreas       ,
      cardioArea    ,
      weightArea        ,
      indoorArea         ,
      outdoorArea     ,
      gardenArea       ,
    } = req.body;

    const floorCount = isNaN(parseInt(numberOfFloors)) ? null : parseInt(numberOfFloors);
    const plotAreaCount = isNaN(parseInt(plotArea)) ? null : parseInt(plotArea);
    const bedroomCount = isNaN(parseInt(bedrooms)) ? null : parseInt(bedrooms);
    const bathroomCount = isNaN(parseInt(bathrooms)) ? null : parseInt(bathrooms);
    const balconyCount = isNaN(parseInt(balcony)) ? null : parseInt(balcony);
    const kitchenCount = isNaN(parseInt(kitchens)) ? null : parseInt(kitchens);
    const lengthCount = isNaN(parseInt(length)) ? null : parseInt(length);
    const widthCount = isNaN(parseInt(width)) ? null : parseInt(width);
    const amountCount = isNaN(parseInt(amount)) ? null : parseInt(amount);
    const livingroomCount = isNaN(parseInt(livingrooms)) ? null : parseInt(livingrooms);
    const dinningroomCount = isNaN(parseInt(dinningrooms)) ? null : parseInt(dinningrooms);
    const garageCapacityCount = isNaN(parseInt(garageCapacity)) ? null : parseInt(garageCapacity);
    const constructionYearCount = isNaN(parseInt(constructionYear)) ? null : parseInt(constructionYear);

    const masterBedroomCount = isNaN(parseInt(masterBedroom)) ? null : parseInt(masterBedroom);
    const guestRoomsCount = isNaN(parseInt(guestRooms)) ? null : parseInt(guestRooms);
    const kidsRoomsCount = isNaN(parseInt(kidsRooms)) ? null : parseInt(kidsRooms);
    const drawingHallCount = isNaN(parseInt(drawingHall)) ? null : parseInt(drawingHall);
    const toiletsCount = isNaN(parseInt(toilets)) ? null : parseInt(toilets);
    const templeCount = isNaN(parseInt(temple)) ? null : parseInt(temple);
    const storeRoomsCount = isNaN(parseInt(storeRooms)) ? null : parseInt(storeRooms);
    const washAreaCount = isNaN(parseInt(washArea)) ? null : parseInt(washArea);
    const gardensCount = isNaN(parseInt(gardens)) ? null : parseInt(gardens);
    const porcheCount = isNaN(parseInt(porche)) ? null : parseInt(porche);
    const swimmingPoolsCount = isNaN(parseInt(swimmingPools)) ? null : parseInt(swimmingPools);
    const barsCount = isNaN(parseInt(bars)) ? null : parseInt(bars);
    const liftsCount = isNaN(parseInt(lifts)) ? null : parseInt(lifts);
    const shopsCount = isNaN(parseInt(shops)) ? null : parseInt(shops);
    const flatsCount = isNaN(parseInt(flats)) ? null : parseInt(flats);
    const parkingsCount = isNaN(parseInt(parkings)) ? null : parseInt(parkings);
    const marriageHallsCount = isNaN(parseInt(marriageHalls)) ? null : parseInt(marriageHalls);
    const restaurantsCount = isNaN(parseInt(restaurants)) ? null : parseInt(restaurants);
    const aretoCount = isNaN(parseInt(areto)) ? null : parseInt(areto);
    const classroomsCount = isNaN(parseInt(classrooms)) ? null : parseInt(classrooms);
    const officeCabinsCount = isNaN(parseInt(officeCabins)) ? null : parseInt(officeCabins);
    const sportsGroundsCount = isNaN(parseInt(sportsGrounds)) ? null : parseInt(sportsGrounds);
    const laboratoryCount = isNaN(parseInt(laboratory)) ? null : parseInt(laboratory);
    const libraryCount = isNaN(parseInt(library)) ? null : parseInt(library);
    const auditoriumCount = isNaN(parseInt(auditorium)) ? null : parseInt(auditorium);
    const conferenceRoomsCount = isNaN(parseInt(conferenceRooms)) ? null : parseInt(conferenceRooms);
    const hallsCount = isNaN(parseInt(halls)) ? null : parseInt(halls);
    const serverRoomsCount = isNaN(parseInt(serverRooms)) ? null : parseInt(serverRooms);
    const stairsCount = isNaN(parseInt(stairs)) ? null : parseInt(stairs);
    const bedsCount = isNaN(parseInt(beds)) ? null : parseInt(beds);
    const doctorCabinsCount = isNaN(parseInt(doctorCabins)) ? null : parseInt(doctorCabins);
    const OPDCount = isNaN(parseInt(OPD)) ? null : parseInt(OPD);
    const genWardCount = isNaN(parseInt(genWard)) ? null : parseInt(genWard);
    const emergencyWardCount = isNaN(parseInt(emergencyWard)) ? null : parseInt(emergencyWard);
    const seatingCapacityCount = isNaN(parseInt(seatingCapacity)) ? null : parseInt(seatingCapacity);
    const roomsCount = isNaN(parseInt(rooms)) ? null : parseInt(rooms);
    const gatheringAreasCount = isNaN(parseInt(gatheringAreas)) ? null : parseInt(gatheringAreas);
    const activityAreaCount = isNaN(parseInt(activityArea)) ? null : parseInt(activityArea);
    const numberOfSeatsCount = isNaN(parseInt(numberOfSeats)) ? null : parseInt(numberOfSeats);
    const screensCount = isNaN(parseInt(screens)) ? null : parseInt(screens);
    const cafesCount = isNaN(parseInt(cafes)) ? null : parseInt(cafes);
    const banquetHallsCount = isNaN(parseInt(banquetHalls)) ? null : parseInt(banquetHalls);
    const sportsAreaCount = isNaN(parseInt(sportsArea)) ? null : parseInt(sportsArea);
    const spaCount = isNaN(parseInt(spa)) ? null : parseInt(spa);
    const medicalCount = isNaN(parseInt(medical)) ? null : parseInt(medical);
    const theaterCount = isNaN(parseInt(theater)) ? null : parseInt(theater);
    const conferenceHallsCount = isNaN(parseInt(conferenceHalls)) ? null : parseInt(conferenceHalls);
    const machineAreasCount = isNaN(parseInt(machineAreas)) ? null : parseInt(machineAreas);
    const cardioAreaCount = isNaN(parseInt(cardioArea)) ? null : parseInt(cardioArea);
    const weightAreaCount = isNaN(parseInt(weightArea)) ? null : parseInt(weightArea);
    const indoorAreaCount = isNaN(parseInt(indoorArea)) ? null : parseInt(indoorArea);
    const outdoorAreaCount = isNaN(parseInt(outdoorArea)) ? null : parseInt(outdoorArea);
    const gardenAreaCount = isNaN(parseInt(gardenArea)) ? null : parseInt(gardenArea);

    const existingDesign = await prisma.design.findUnique({
      where: { id: parseInt(id) },
      include: {
        designMedia: true,
      },
    });

    if (!existingDesign) {
      throw new Error('Design not found.');
    }

    const media = [];

    if (req.files) {
      const designImagesFiles = Array.isArray(req.files.designImagesUrls) ? req.files.designImagesUrls : req.files.designImagesUrls ? [req.files.designImagesUrls] : [];
      const videosFiles = Array.isArray(req.files.videosUrls) ? req.files.videosUrls : req.files.videosUrls ? [req.files.videosUrls] : [];

      // Check if new siteImages are uploaded, otherwise retain the existing ones
      if (designImagesFiles.length > 0) {
        const designId = getDesignIdFromResponse(existingDesign);
        const folder = `Designs/Design ${designId}/`;
        const designImagesUrls = await Promise.all(designImagesFiles.map((file) => uploadMedia(file, folder)));

        // Delete the existing siteImages if new URLs are provided
        if (existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Image').length > 0) {
          const deleteMediaIds = existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Image').map(mediaItem => mediaItem.id);
          await prisma.designMedia.deleteMany({ where: { id: { in: deleteMediaIds } } });
        }

        designImagesUrls.forEach((url, index) => {
          media.push({ link: url, mediaType: 'Image' });
          req.body[`designImages[${index}]`] = url;
        });
      } else {
        // Retain existing siteImages if no new URLs are provided
        media.push(...existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Image'));
      }

      // Check if new videos are uploaded, otherwise retain the existing ones
      if (videosFiles.length > 0) {
        const designId = getDesignIdFromResponse(existingDesign);
        const folder = `Designs/Design ${designId}/`;
        const videosUrls = await Promise.all(videosFiles.map((file) => uploadMedia(file, folder)));

        // Delete the existing videos if new URLs are provided
        if (existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Video').length > 0) {
          const deleteMediaIds = existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Video').map(mediaItem => mediaItem.id);
          await prisma.designMedia.deleteMany({ where: { id: { in: deleteMediaIds } } });
        }

        videosUrls.forEach((url, index) => {
          media.push({ link: url, mediaType: 'Video' });
          req.body[`videos[${index}]`] = url;
        });
      } else {
        // Retain existing videos if no new URLs are provided
        media.push(...existingDesign.designMedia.filter(mediaItem => mediaItem.mediaType === 'Video'));
      }
    } else {
      // No new media uploaded, retain existing media
      media.push(...existingDesign.designMedia);
    }

    const { designDetailId, propertyDetailId } = existingDesign;

    let updatedDesignDetail;
    if (designDetailId) {
      updatedDesignDetail = await prisma.designDetail.update({
        where: { id: designDetailId },
        data: {
          designCategory,
          designType,
        },
      });
    } else {
      updatedDesignDetail = await prisma.designDetail.create({
        data: {
          designCategory,
          designType,
        },
      });
    }

    // Update property detail if available
    let updatedPropertyDetail;
    if (propertyDetailId) {
      updatedPropertyDetail = await prisma.propertyDetail.update({
        where: { id: propertyDetailId },
        data: {
          propertyCategory,
          propertyType,
          shopType,
        masterBedroom: masterBedroomCount,
        guestRooms: guestRoomsCount,
        kidsRooms: kidsRoomsCount,
        drawingHall: drawingHallCount,
        toilets: toiletsCount,
        temple: templeCount,
        storeRooms: storeRoomsCount,
        washArea: washAreaCount,
        gardens: gardensCount,
        porche: porcheCount,
        swimmingPools: swimmingPoolsCount,
        bars: barsCount,
        lifts: liftsCount,
        shops: shopsCount,
        flats: flatsCount,
        parkings: parkingsCount,
        marriageHalls: marriageHallsCount,
        restaurants: restaurantsCount,
        areto: aretoCount,
        classrooms: classroomsCount,
        officeCabins: officeCabinsCount,
        sportsGrounds: sportsGroundsCount,
        laboratory: laboratoryCount,
        library: libraryCount,
        auditorium: auditoriumCount,
        conferenceRooms: conferenceRoomsCount,
        halls: hallsCount,
        serverRooms: serverRoomsCount,
        stairs: stairsCount,
        beds: bedsCount,
        doctorCabins: doctorCabinsCount,
        OPD: OPDCount,
        genWard: genWardCount,
        emergencyWard: emergencyWardCount,
        seatingCapacity: seatingCapacityCount,
        rooms: roomsCount,
        gatheringAreas: gatheringAreasCount,
        activityArea: activityAreaCount,
        numberOfSeats: numberOfSeatsCount,
        screens: screensCount,
        cafes: cafesCount,
        banquetHalls: banquetHallsCount,
        sportsArea: sportsAreaCount,
        spa: spaCount,
        medical: medicalCount,
        theater: theaterCount,
        conferenceHalls: conferenceHallsCount,
        machineAreas: machineAreasCount,
        cardioArea: cardioAreaCount,
        weightArea: weightAreaCount,
        indoorArea: indoorAreaCount,
        outdoorArea: outdoorAreaCount,
        gardenArea: gardenAreaCount
        },
      });
    } else {
      updatedPropertyDetail = await prisma.propertyDetail.create({
        data: {
          propertyCategory,
          propertyType,
          shopType,
        masterBedroom: masterBedroomCount,
        guestRooms: guestRoomsCount,
        kidsRooms: kidsRoomsCount,
        drawingHall: drawingHallCount,
        toilets: toiletsCount,
        temple: templeCount,
        storeRooms: storeRoomsCount,
        washArea: washAreaCount,
        gardens: gardensCount,
        porche: porcheCount,
        swimmingPools: swimmingPoolsCount,
        bars: barsCount,
        lifts: liftsCount,
        shops: shopsCount,
        flats: flatsCount,
        parkings: parkingsCount,
        marriageHalls: marriageHallsCount,
        restaurants: restaurantsCount,
        areto: aretoCount,
        classrooms: classroomsCount,
        officeCabins: officeCabinsCount,
        sportsGrounds: sportsGroundsCount,
        laboratory: laboratoryCount,
        library: libraryCount,
        auditorium: auditoriumCount,
        conferenceRooms: conferenceRoomsCount,
        halls: hallsCount,
        serverRooms: serverRoomsCount,
        stairs: stairsCount,
        beds: bedsCount,
        doctorCabins: doctorCabinsCount,
        OPD: OPDCount,
        genWard: genWardCount,
        emergencyWard: emergencyWardCount,
        seatingCapacity: seatingCapacityCount,
        rooms: roomsCount,
        gatheringAreas: gatheringAreasCount,
        activityArea: activityAreaCount,
        numberOfSeats: numberOfSeatsCount,
        screens: screensCount,
        cafes: cafesCount,
        banquetHalls: banquetHallsCount,
        sportsArea: sportsAreaCount,
        spa: spaCount,
        medical: medicalCount,
        theater: theaterCount,
        conferenceHalls: conferenceHallsCount,
        machineAreas: machineAreasCount,
        cardioArea: cardioAreaCount,
        weightArea: weightAreaCount,
        indoorArea: indoorAreaCount,
        outdoorArea: outdoorAreaCount,
        gardenArea: gardenAreaCount
        },
      });
    }

    const updatedDesignData = {
      title: title !== undefined ? title : existingDesign.title,
      description: description !== undefined ? description : existingDesign.description,
      isFree: isFree !== undefined && isFree !== null ? JSON.parse(isFree) : existingDesign.isFree,
      amount: amount !== undefined ? amountCount : existingDesign.amount,
      plotArea: plotArea !== undefined ? plotAreaCount : existingDesign.plotArea,
      numberOfFloors: numberOfFloors !== undefined ? floorCount : existingDesign.numberOfFloors,
      facing: facing !== undefined && facing !== '' ? facing : existingDesign.facing,
      bedrooms: bedrooms !== undefined ? bedroomCount : existingDesign.bedrooms,
      bathrooms: bathrooms !== undefined ? bathroomCount : existingDesign.bathrooms,
      length: length !== undefined ? lengthCount : existingDesign.length,
      width: width !== undefined ? widthCount : existingDesign.width,
      balcony: balcony !== undefined ? balconyCount : existingDesign.balcony,
      kitchens: kitchens !== undefined ? kitchenCount : existingDesign.kitchens,
      livingrooms: livingrooms !== undefined ? livingroomCount : existingDesign.livingrooms,
      dinningrooms: dinningrooms !== undefined ? dinningroomCount : existingDesign.dinningrooms,
      garageCapacity: garageCapacity !== undefined ? garageCapacityCount : existingDesign.garageCapacity,
      constructionYear: constructionYear !== undefined ? constructionYearCount : existingDesign.constructionYear,
      vastu: vastu !== undefined && vastu !== null ? JSON.parse(vastu) : existingDesign.vastu,
      unitType: unitType !== undefined && unitType !== '' ? unitType : existingDesign.unitType,
      designDetail: {
        connect: { id: updatedDesignDetail.id }, // Link the updated design detail
      },
      propertyDetail: {
        connect: { id: updatedPropertyDetail.id }, // Link the updated property detail
      },
      designMedia: {
        create: media.map(item => ({
          link: item.link,
          mediaType: item.mediaType,
        })),
      },
      updatedAt: new Date(),
    };

    const updatedDesign = await prisma.design.update({
      where: { id: parseInt(id) },
      data: updatedDesignData,
    });

    const response = {
      success: true,
      designImagesUrls: media.filter(mediaItem => mediaItem.mediaType === 'Image').map(mediaItem => mediaItem.link),
      videosUrls: media.filter(mediaItem => mediaItem.mediaType === 'Video').map(mediaItem => mediaItem.link),
      
        ...updatedDesign,
        propertyCategory,
        propertyType,
        shopType,
        masterBedroom: masterBedroomCount,
        guestRooms: guestRoomsCount,
        kidsRooms: kidsRoomsCount,
        drawingHall: drawingHallCount,
        toilets: toiletsCount,
        temple: templeCount,
        storeRooms: storeRoomsCount,
        washArea: washAreaCount,
        gardens: gardensCount,
        porche: porcheCount,
        swimmingPools: swimmingPoolsCount,
        bars: barsCount,
        lifts: liftsCount,
        shops: shopsCount,
        flats: flatsCount,
        parkings: parkingsCount,
        marriageHalls: marriageHallsCount,
        restaurants: restaurantsCount,
        areto: aretoCount,
        classrooms: classroomsCount,
        officeCabins: officeCabinsCount,
        sportsGrounds: sportsGroundsCount,
        laboratory: laboratoryCount,
        library: libraryCount,
        auditorium: auditoriumCount,
        conferenceRooms: conferenceRoomsCount,
        halls: hallsCount,
        serverRooms: serverRoomsCount,
        stairs: stairsCount,
        beds: bedsCount,
        doctorCabins: doctorCabinsCount,
        OPD: OPDCount,
        genWard: genWardCount,
        emergencyWard: emergencyWardCount,
        seatingCapacity: seatingCapacityCount,
        rooms: roomsCount,
        gatheringAreas: gatheringAreasCount,
        activityArea: activityAreaCount,
        numberOfSeats: numberOfSeatsCount,
        screens: screensCount,
        cafes: cafesCount,
        banquetHalls: banquetHallsCount,
        sportsArea: sportsAreaCount,
        spa: spaCount,
        medical: medicalCount,
        theater: theaterCount,
        conferenceHalls: conferenceHallsCount,
        machineAreas: machineAreasCount,
        cardioArea: cardioAreaCount,
        weightArea: weightAreaCount,
        indoorArea: indoorAreaCount,
        outdoorArea: outdoorAreaCount,
        gardenArea: gardenAreaCount,
        designCategory,
        designType,
      
    };
    
  const uniqueImagesUrls = new Set(response.designImagesUrls);
  const uniqueVideosUrls = new Set(response.videosUrls);

  for (const key in response) {
    if (response[key] === null) {
      delete response[key];
    }
  }

  res.status(200).json({
    ...response,
    designImagesUrls: Array.from(uniqueImagesUrls),
    videosUrls: Array.from(uniqueVideosUrls),
  });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteDesign = async (req, res, next) => {
  const { id } = req.query;
  try {
    await prisma.designMedia.deleteMany({
      where: { designId: parseInt(id) },
    });

    await prisma.designDetail.deleteMany({
      where: { designs: { some: { id: parseInt(id) } } },
    });

    await prisma.propertyDetail.deleteMany({
      where: { designs: { some: { id: parseInt(id) } } },
    });

    const deletedDesign = await prisma.design.delete({
      where: { id: parseInt(id) },
    });

    if (deletedDesign) {
      res.status(200).json({ message: "Design deleted successfully" });
    } else {
      res.status(404).json({ error: "Design not found" });
    }
  } catch (error) {
    console.error("Error deleting design:", error);
    res.status(500).json({ error: "Failed to delete design" });
  }
};