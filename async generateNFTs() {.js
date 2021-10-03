async generateNFTs() {
    this.publishSubscribe.dispatchEventGlobal(
      EventNames.MODAL_PROGRESS_TEXT,
      ""
    );
    this.publishSubscribe.dispatchEventGlobal(
      EventNames.MODAL_PROGRESS_DISPLAY,
      true
    );
    this.cachedImages = {};
    this.cancelImageGenerationProcess = false;
    for (let i = 0; i < this.images.length; i++) {
      if (this.cancelImageGenerationProcess) {
        break;
      }
      await this.generateImage(this.images[i], this.getImageName(i));
      await this.generateMetaData(
        this.images[i],
        this.getMetadataName(i),
        this.getImageName(i)
      );

      this.publishSubscribe.dispatchEventGlobal(
        EventNames.MODAL_PROGRESS_TEXT,
        "created image " + i + " of " + this.images.length
      );
    }
    this.publishSubscribe.dispatchEventGlobal(
      EventNames.MODAL_PROGRESS_DISPLAY,
      false
    );
    if (this.cancelImageGenerationProcess) {
      this.publishSubscribe.dispatchEventGlobal(EventNames.MODAL_INFO_DISPLAY, {
        text: "image generation cancelled",
        display: true,
      });
    }else{
      this.publishSubscribe.dispatchEventGlobal(EventNames.MODAL_INFO_DISPLAY, {
        text: "image generation complete",
        display: true,
      });
    }
   
  }
  getImageName(index) {
    return "image_" + index;
  }
  async generateImage(imageData, fileName) {
    //draw layers into canvas
    let basePath = ListingEntityController.getPathFull(
      ListingEntityController.rootEntityKey
    );
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (const dataItem of imageData.dataCollection) {
      if (
        this.cachedImages[dataItem.entityKey] === null ||
        this.cachedImages[dataItem.entityKey] === undefined
      ) {
        this.publishSubscribe.dispatchEventGlobal(
          EventNames.MODAL_PROGRESS_TEXT,
          "creating cache for " + dataItem.name
        );
        const image = await loadImage(
          ListingEntityController.getPath(dataItem.entityKey)
        );
        this.ctx2.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx2.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
        let path = `${basePath}/cache/images/${dataItem.entityKey}.png`;
        await this.saveImage(path, this.canvas2);
        this.cachedImages[dataItem.entityKey] = await loadImage(path);
      }

      this.ctx.drawImage(
        this.cachedImages[dataItem.entityKey],
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
    }

    await this.saveImage(
      `${basePath}/output/images/${fileName}.png`,
      this.canvas
    );
  }
  async saveImage(path, canvasRef) {
    try {
      await fs.outputFile(path, canvasRef.toBuffer("image/png"));
    } catch (err) {
      this.publishSubscribe.dispatchEventGlobal(
        EventNames.MODAL_ERROR_DISPLAY,
        { text: err, display: true }
      );
    }
  }
  getMetadataName(index) {
    return "metadata_" + index;
  }
  async generateMetaData(imageData, fileNameMetadata, fileNameImage) {
    //generate metadata
    let attributes = [];
    for (const dataItem of imageData.dataCollection) {
      attributes.push(dataItem.attributes);
    }
    let metadata = JSON.stringify({
      name: fileNameImage,
      attributes: attributes,
    });
    await this.saveMetaData(fileNameMetadata, metadata);
  }

  async saveMetaData(fileName, metadata) {
    try {
      let basePath = ListingEntityController.getPathFull(
        ListingEntityController.rootEntityKey
      );
      await fs.outputFile(
        `${basePath}/output/metadata/${fileName}.json`,
        metadata
      );
    } catch (err) {
      this.publishSubscribe.dispatchEventGlobal(
        EventNames.MODAL_ERROR_DISPLAY,
        { text: err, display: true }
      );
    }
    //
  }