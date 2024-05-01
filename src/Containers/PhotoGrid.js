import React from "react";
import { useEffect, useState, useRef, useCallback, cloneElement} from "react";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';
import { Heart } from '../My.styled'
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
import { debounce} from "lodash";
// import ImageModal from "../components/ImageModal";


const PhotoGrid = React.memo(( props ) => {
  const location = useLocation();
//   window.addEventListener('wheel', function(e) {  
//     e.preventDefault();
//     // add custom scroll code if you want
// })

  const gridRef = useRef(null);
  const grid = gridRef.current;
  const gridRect = grid?.getBoundingClientRect() 
  const gridWrapperRef = useRef(null)
  const gridWrapper = document.getElementById("grid-wrapper");
  const gridWrapperRect = gridWrapper?.getBoundingClientRect()
  const gridWrapperWidth = gridWrapperRect?.width
  const height = gridWrapperRect?.height

  const left = gridWrapperRect?.width * .5
  const top = gridWrapperRect?.height * .3

  const [photos, setPhotos] = useState(null)
  const [photoId, setPhotoId] = useState(false)
  const [range, setRange] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [rowOverlap, setRowOverlap] = useState([0])
  const [updPhoto, setUpdPhoto] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)

  const sortPhotos = (a, b) => a.index - b.index;

  useEffect(() => {
    if (!!gridRect){  
      const justifyCenter = gridRect.width/3
      const alignCenter = window.innerHeight/5
      gridWrapper.scrollLeft = justifyCenter
      gridWrapper.scrollTop = alignCenter
      // console.log("scroll", gridWrapper, center, gridRect)
      console.log("scrollTo", gridRect, justifyCenter)
    }
  }, [!!gridRef.current === true])


  useEffect(() => {    
    
    if (!!props?.photos?.length){
      
      const newArray = [...props.photos.sort(sortPhotos)]
      // find all portrait photos in array
      let portraitPhotos = [...newArray.filter((photo) => photo.orientation !== true)]
      // find the photo under each portrait photo. this is due to how the dnd grid is ordered on desktop
      let photosUnder = [...portraitPhotos.map((photo) => { 
      let photoUnder = newArray[photo.index + 6]
      return photoUnder
      })]
      
      const splicedArr = [...props.photos]
      // remove the photos under to maintain order
      photosUnder?.forEach(x => splicedArr?.splice(splicedArr?.findIndex(n => n?.id === x?.id), 1));

      const makePhoto = (i) => {
        let photo = {}
        photo.index = newArray.length + i - 1
        photo.id = null
        photo.url = null
        photo.thumbnail_url = null
        photo.name = null
        photo.details = null
        photo.u_id = null
        photo.folder_id = null
        photo.orientation = true
        return photo
      }
      // the number of photos removed from the previous folder
      const oldVal = [photos?.filter((photo) => photo.orientation !== true)].length - 1
      // the number of photos to fill up the current row
      const lossVal = Math.ceil((splicedArr.length/6)) 
      // because 60/6 is 10 addVal negates getting an incorrect count
      // ^THIS  MAY BE ACTUALLY REVERSED ie lossVal - 6?
      const addVal = !!photosUnder.length ? lossVal : 0

      // console.log("portraits", portraitPhotos, splicedArr, addVal, !!splicedArr.length, lossVal)

      const addMore = []

      // add the total counts to make two rows of padding and make up the difference
      for (let i = 0; i < (oldVal  + (11 -lossVal)); i++) {
        let photo = makePhoto(i)
        addMore.push(photo);
        }
        // combine the two new arrays
       const combinedArr = [splicedArr, addMore].flat(Infinity)
       // chop into multiple arrays of 6
       const choppedArray = combinedArr.sort(sortPhotos).reduce(function (rows, key, index) { 
        return (index % 6 == 0 ? rows.push([key]) 
          : rows[rows.length-1].push(key)) && rows;
      }, []);
    
      const makeBumper = (i) => {
      let photo = {}
      photo.index = null
      photo.id = null
      photo.url = false
      photo.thumbnail_url = null
      photo.name = null
      photo.details = null
      photo.u_id = null
      photo.folder_id = null
      photo.orientation = true
      photo.row = (i*100)+1
      photo.place = 0
      return photo
      }

      // add a "bumper" photo at both ends of each array
      for (let i = 0; i <= (choppedArray?.length); i++) {    
        // console.log("bumper", i)
          let photo = makeBumper(i)
          photo.bumper = 'left' 
          let photoB = makeBumper(i)
          photoB.bumper = 'right'
          choppedArray[i]?.unshift(photo);
          choppedArray[i]?.push(photoB);
          }

    // console.log("choppedArray", choppedArray)
    
    const flatArr = choppedArray?.flat(Infinity)
    
    let tally = 0
    
    // update indexes of the new array under the new value of "place" so not to alter the original index and break the reordering on future renders
    const reindexedArr = flatArr?.map((photo, i) => {
        if(photo?.orientation !== true){
          tally = tally + 1
        }
        photo.place = i
        return photo
      }) 
      // find rows where there are multiple portriat photos so we can adjust how many bumpers we shrink later to keep the grid in order
      const conflictRows = photosUnder.map((x) => Math.floor(x.place/8));

      const setData = [...new Set(conflictRows)];

      setRowOverlap(setData)
      setPhotos(reindexedArr)
      // console.log("useEffect", reindexedArr)
      
  }
  }, [props?.photos])


  const imgCounter = (i) => {
    // setImgCount(imgCount + 1)
    if (i + 1 === photos?.length){
      console.log("images loaded", i, photos?.length)
      adjustFunction()
      
    }
  }
  
useEffect(() => {
  console.log("useEffect adjust photos")
  adjustFunction()
}, [photos])


  const [photo, setPhoto] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [photoPos, setPhotoPos] = useState([0,0,0,0])

  const modalToggle = (photoState) => {
    // find element in the top center of screen
    const elem = document?.elementsFromPoint(gridWrapperWidth * .5, height * .4)[1]
    const id = +elem.id

    // console.log("photo", photoState, elem)
      
      if (!!openModal) {
        setOpenModal(!openModal);
        var log_once = debounce(log, 500);
        function log() {
          setPhoto(null);
        }
        log_once();
      }
      else if (photoState.place === id){
        
        const gridItem = elem?.getBoundingClientRect();
        
        setPhotoPos([gridItem.left, gridItem.top, window.innerHeight, window.innerWidth])
        setPhoto(photoState);

        var log_once = debounce(log, 50);
        function log() {
          setOpenModal(!openModal);
        }
        log_once();
        
    }
  };
  
  const opacity = imagesLoaded ? 1 : 0
  const display = openModal ? "none" : "inline"
  

  const adjustFunction = () => {
    console.log("adjust")
    const photos = grid?.children
    const ids = []
    const shrunkPhotos = []

    const unShrink = (photoToSize, bool, rowVal) =>{
      if (!!photoToSize){
        if (bool){
          photoToSize.style.gridColumnStart = `span 120`
          photoToSize.style.gridRowStart = ` ${rowVal}`
          photo.firstChild.style.height = '95px'
        }
        else{
          photoToSize.style.gridColumnEnd = `span 120`
          photoToSize.style.gridRowStart = ` ${rowVal}`
          photo.firstChild.style.height = '95px'
        }
      }
    }

    for (let i = 0; i < (photos?.length + 1); i++) {
      let photo = photos[i]; // each square is "photo"

      if(!!photo?.getElementsByClassName("photo")){
        const orientation = !!photo.getElementsByClassName("portrait").length
        const isBumper = !!photo.getElementsByClassName("bumper").length
        const isTile = !!photo.getElementsByClassName("tile").length
        
        const offTop = photo?.offsetTop
        const topDistOfPhoto = Math.floor(offTop/100)*100 + 1
        const onRightOfGrid = photo?.offsetLeft > grid.offsetWidth/2
        const offLeft = photo?.offsetLeft
        const rightColNum = (offLeft/119) - 2
         

        if (!isBumper){
          
          photo.style.gridRowStart = `auto`
          if (isTile){
            photo.style.gridColumnStart = `span 118`
            photo.style.gridRowEnd = `span 100`
            photo.firstChild.style.width = '115px'
            photo.firstChild.style.height = '95px'
          }
          else {
            // if (rightColNum === 4){
            
            //   const leftVal = rightColNum * 119
            //   photo.style.gridColumnStart = `${leftVal}`
            //   console.log("right", photo, rightColNum, leftVal)
            // }
            // else 
    //         grid-row-start: auto;
            // grid-column-start: auto;
            // grid-row-end: span 100;
            // grid-column-end: span 118;
            if (rightColNum >= 4){
              photo.style.gridColumnEnd = `span 118`
              photo.style.gridColumnStart = `auto`
            }
            else {
              photo.style.gridColumnEnd = `span 118`
              photo.style.gridColumnStart = `auto`
            }
            if (!orientation){
              // photo.style.gridRowStart = `${topDistOfPhoto}`
              photo.style.gridRowEnd = `span 100`
              photo.firstChild.style.width = '115px'
              photo.firstChild.style.height = '95px'
            }
            else {
              // photo.style.gridRowStart = `${topDistOfPhoto}`
              photo.style.gridRowEnd = `span 200`
              photo.firstChild.style.width = '115px'
              photo.firstChild.style.height = '190px'
            }
          }
          }
           else {
            photo.firstChild.style.height = '95px'
            photo.style.gridRowStart = ` ${topDistOfPhoto}`
             photo.firstChild.style.width = '115px'
            // unShrink(photo, bool, topDistOfPhoto)
            if (rightColNum >= 4){
              photo.style.gridColumnEnd = `948`
              photo.style.gridColumnStart = `span 120`
            }
            else {
              photo.style.gridColumnEnd = `span 118`
              photo.style.gridColumnStart = `1`
            }
            
          }
    }
  }
  setImagesLoaded(true)
}
  

  const scrollPosition = () => {

    if (photo === null){
    
    const photos = grid?.children
    
    
    const elem = document?.elementsFromPoint(gridWrapperWidth * .5, height * .3)
    const id = +elem[0]?.id

    const findCenter = () => {
      let centeredArr = []
      const isPhotoCentered = !!elem[1]?.getElementsByClassName("picture").length 

      if (isPhotoCentered && !!id){
        // console.log("scroll")
        const gridItem = elem[1]?.getBoundingClientRect();
        const positionX = gridItem.left + elem[0].offsetWidth/2;
        const positionY = gridItem.top + elem[0].offsetHeight/2
        const offleftDiff =  Math.abs(gridWrapperWidth * .5 - positionX)
        const offTopDiff = Math.abs(height * .3 - positionY)
  
        const val = !!photoId ? .5 : .4
        const maxLeft = (elem[0].offsetWidth*val)
        const maxTop = (elem[0].offsetHeight*val)

        const centered = offleftDiff < maxLeft && offTopDiff < maxTop

        if (centered !== false){
          return id
        }
        
      }
      return false
    }

    const centeredId = findCenter()

    // console.log("centeredId", centeredId)

    const changeCells = (centeredId) => {
      
      if (photoId !== centeredId && id !== photoId){
        // console.log("change")
        const centeredPhoto = photos[centeredId]
        const centeredOrientation = !!centeredPhoto?.getElementsByClassName("portrait").length
        const offTop = centeredPhoto?.offsetTop
        const offLeft = centeredPhoto?.offsetLeft
        const topDistOfPhoto = Math.floor(offTop/100)*100 + 1
        

        // + or - for column start and + 1 for next
        // RIGHT
        const rightColNum = (Math.floor(offLeft/119) - 2)
        // LEFT
        const leftColNum = (Math.floor(offLeft/119) - 1)

        // 2 REPRESENTS THE NUMBER OF SQUARES THE PHOTO WILL OCCUPY WHEN IT GROWS
        // "leftColNum" REPRESENTS THE STARTING POINT TO SUBTRACT FROM
        // leftColNum - 2 GET THE EXACT DIFFERENCE FROM THE DESIRED START OR END WHEN SETTING THE PHOTO

        // RIGHT
        const rightCorrection = rightColNum - 2
        // LEFT
        const leftCorrection = leftColNum - 2

        const leftDistOfRightPhoto = (rightColNum * 119) - rightCorrection
        // const leftDistOfRightPhoto = (Math.floor(offLeft/119) - 2) * 119
        const rightDistOfLeftPhoto = (leftColNum * 119) - leftCorrection
        // const rightDistOfLeftPhoto = (Math.floor(offLeft/119) - 1) * 119

        // TRUE === RIGHT SIDE OF GRID
        // const onRightOfGrid = centeredPhoto?.offsetLeft > grid.offsetWidth/2
        const onRightOfGrid = rightColNum >= 4
        
        
        
        const rowConflict = !!rowOverlap.filter((rowNum) => { 
          if (Math.floor(offTop/100) === rowNum){
            return true
          }}).length

        const rowNum = Math.floor(offTop/100)
        

      const unInlarge = () => {
        const oldPhoto = photos[photoId]
        
          const oldOrientation = !!oldPhoto?.getElementsByClassName("portrait").length
          const isPrevBumper = !!oldPhoto?.getElementsByClassName("bumper").length
          const oldOffLeft = oldPhoto?.offsetLeft
          const rightColNum = (oldOffLeft/119) - 2

          const oldOnRightOfGrid = Math.floor(oldOffLeft/118) > 4

          if (oldPhoto !== undefined){
            // oldPhoto.style.background = `black`
            oldPhoto.firstChild.style.width = '110px'
            oldPhoto.style.gridRowStart = `auto`
            console.log("unInlarge", oldPhoto, rightColNum)
            // if (rightColNum === 4){
            //   // LEFT MOST ON RIGHT SIDE
            //   oldPhoto.style.gridColumnEnd = `span 118`
            // }
            // else
            
             if (rightColNum >= 4){
              // RIGHT SIDE
              oldPhoto.style.gridColumnEnd = `span 118`
              oldPhoto.style.gridColumnStart = `auto`
            }
            else {
              // LEFT SIDE
              oldPhoto.style.gridColumnEnd = `auto`
              oldPhoto.style.gridColumnStart = `span 118`
            }

            
            if (!oldOrientation){

              oldPhoto.style.gridRowEnd = `span 100`
              oldPhoto.firstChild.style.height = '95px'
            }
            else {
              oldPhoto.style.gridRowEnd = `span 200`
              oldPhoto.firstChild.style.height = '220px'
            }
            unShrink(range)
        }
      }
      const unShrink = () => {
        // console.log("unShrink")
        if (!!range.length){
        let unShrinkPhotos = []
        range.map((i) => { 
          if (!!(i%2)){
            let photo = photos[i]
            unShrinkPhotos.push(photo)
            photo.style.gridColumnStart = `span 120`
            return photo
          }
          else {
            let photo = photos[i]
            unShrinkPhotos.push(photo)
            photo.style.gridColumnEnd = `span 119`
            return photo
            }
          })
        }
      }
      const inlarge = () => {  
        
          if (rightColNum === 4){
          
          }
          if (onRightOfGrid){
            
            // RIGHT SIDE
            // console.log("inlarge right", centeredPhoto, leftDistOfRightPhoto)

            centeredPhoto.style.gridRowStart = `${topDistOfPhoto}`
            centeredPhoto.style.gridColumnEnd = `span 236`
            centeredPhoto.style.gridColumnStart = `${leftDistOfRightPhoto}`
          }
          else {
            // LEFT SIDE
            // console.log("left", offLeft, Math.floor(offLeft/119), rightDistOfLeftPhoto)
            centeredPhoto.style.gridRowStart = `${topDistOfPhoto}`
            centeredPhoto.style.gridColumnStart = `span 236`
            centeredPhoto.style.gridColumnEnd = `${rightDistOfLeftPhoto}`
          }
          if (centeredOrientation){
            centeredPhoto.style.gridRowEnd = `span 300`
            centeredPhoto.firstChild.style.width = '230px'
            centeredPhoto.firstChild.style.height = '295px'
          }
          else {
            centeredPhoto.style.gridRowEnd = `span 200`
            centeredPhoto.firstChild.style.width = '230px'
            centeredPhoto.firstChild.style.height = '190px'
          }
      }
      const shrink = () => {
        const ids = []
        const shrunkPhotos = []
        const rowAdd = (rowConflict ? 0 : 1)
        const rowCount = (centeredOrientation ? 2 : 1) + rowAdd
        const first = onRightOfGrid ? rowNum * 8 + 7 : rowNum * 8
        const lastRow = (rowCount * 8 + first)
        const rowSpan = (lastRow < photos.length) ? rowCount : rowCount - rowAdd
        
        // console.log("shrinkMap", rowSpan, centeredPhoto, first)
        
        for (let i = 0; i <= rowSpan; i++){

              const shrunkIndex = i * 8 + first
              const photoToShrink = photos[shrunkIndex]
              

              shrunkPhotos.push(photoToShrink)

              // console.log("shrunkIndex inlarge", i, first, shrunkIndex, rowSpan, photoToShrink)
          
              if (photoToShrink !== undefined){
                ids.push(shrunkIndex)
                if (onRightOfGrid){
                photoToShrink.style.gridColumnStart = `span 1`
                }
                else {
                photoToShrink.style.gridColumnEnd = `span 1`            
                }
                
              }
              if (i === rowSpan || photoToShrink === undefined){
                inlarge() 
              }
            }
            setRange(ids)
            return shrunkPhotos
      }


      if (centeredId === false && photoId !== false){
          // console.log(`centeredArr${photoId}x`, "un center oldPhoto", photos[photoId], photoId, centeredId, id)

          setPhotoId(false)
          setPhotoPos(null)
          unInlarge()
          // adjustFunction()
      }
      else if (photoId === false){
          console.log(centeredId)

          setPhotoId(centeredId)
          // unInlarge()
          shrink() 
        }
      }
    }
    centeredId !== undefined && changeCells(centeredId)
  }
}
console.log("props?.folderDetails?.collaborators", props?.folderDetails?.collaborators)

// useEffect(() => { console.log("useEffect render", photos?.length)})
// const folderName = props?.folderDetails[props?.folderDetails?.id]?.name
    // const favoritesName = !!props?.favoriteDetails && props?.favoriteDetails[props?.folderDetails?.id]?.name
    // const collabName = !!props.collabDetails && props.collabDetails[props?.folderDetails?.id]?.name

const index = +(location.pathname.split('/')[3])
// console.log("props.collabs", props.collabs, !!props?.collabs?.length)
  return (
    <article >

      
              {!!photo && 
              <GridItem
                    // className="grid-item double"
                    // id={i}
                    className={photo.orientation ? "grid-item double landscape" : "grid-item double portrait"}
                    double={true}
                    openModal={openModal}
                    left={photoPos[0]}
                    top={photoPos[1]}
                    viewportY={photoPos[2]}
                    viewportX={photoPos[3]}
                    key={photo.index}
                    orientation={photo.orientation}
                    url={!!photo.url}
                    photo={photo}
                    collaborator={!!photo.u_id && props?.folderDetails?.collaborators.filter(user => user.uuid === photo.u_id)}
                  >
                    <PictureFrame
                      className={photo.orientation ? "picture landscape" : "picture portrait"}
                      // alt={}
                      highlight={photo.color}
                      contentSizing={!!photo.name || !!photo.details}
                      onClick={() => modalToggle(photo)}

                      // loading="lazy"
                      loading="eager"
                      src={photo.thumbnail_url}
                    />
                    {(photo.details || photo.name) 
                      && <div className="content-drawer">
                        <div className="card-content" >
                       
                          {/* {photo.name.map(line =><h4>{line}</h4>)} */}
                          <h4>{photo.name}</h4>
                        <p className={"card-details"} >{photo.details}</p>
                        {!!photo.username && <p className={"card-details"} >{photo.username.name}</p>}
                      </div>
                      </div>}
                    {/* FAVORITE BUTTON */}
{/* <Heart favorited={!!photo.favorites.length} onClick={() => console.log("favorites", (!!photo.favorites.length) && photo.favorites[0].favoritable_id, "user", photo.user_id)} className="heart">♥</Heart> */}
                        {/* {(!!props.currentUserId) && (props.location === "/user" || "/favorites") && 
                        <Heart 
                        favorited={photo.favorites !== undefined && !!photo.favorites.length}
                        className="heart"
                        onClick={() => favoriteToggle
                        (photo)} >♥</Heart>} */}
                  </GridItem>
                  } 

        <>
          <div 
          id="grid-wrapper"
          className="grid-wrapper"
          onScroll={() => scrollPosition()}
          ref={gridWrapperRef}
          >
           {!!props?.collabs?.length && props?.collabs?.length !== undefined && (!Number.isNaN(index)) && (typeof index === "number") && <span>
            {props?.collabs?.map((collab) => <CollabName>w/ {collab?.name}</CollabName>)}
            </span>}

            <FolderName>{props?.folderDetails?.name}</FolderName>
            

            <Grid
              ref={gridRef}
              className="grid"
              // style={{ opacity: imagesLoaded ? 1 : 0 }}
              // style={{ opacity }}
              >
              {photos?.map((photo, i) => (
                <GridItem

                className={photo.url === false ? `grid-item bump ${photo.bumper}` : "grid-item"}
                id={i}
                key={photo.place}
                row={!!photo.row ? photo.row : false}
                orientation={photo.orientation}
                url={!!photo.url}
                photo={photo}
                collaborator={!!photo.u_id && props?.collabs?.filter(user => user.uuid === photo.u_id)}
                // colorArr={props.colorArr}
                highlight={photo.color}
              >
                <PictureFrame
                  id={i}
                  key={photo.place}
                  className={photo.url === false ? "bumper" : photo.url !== null ? photo.orientation ? "picture landscape" : "picture portrait" : 'tile landscape'}
                  // alt={}
                  highlight={photo.color}
                  contentSizing={!!photo.name || !!photo.details}
                  
                  // onLoad={() => imgCounter(photo.index)} 
                  onClick={() => modalToggle(photo)}
              
                  // loading="lazy"
                  loading="lazy"
                  src={
                    !!photo.thumbnail_url
                    ? photo.thumbnail_url
                    : require('../assets/100x135.png')
                  }
                />
              </GridItem>
                ))}
            </Grid>
          </div>
      </>


      </article>
  );
});

export default PhotoGrid;

// const Child = React.memo(({ colorArr, photo, props, collabs, setUnderIndexs, underIndexs, display, favoriteToggle, modalToggle, imgCounter, root, i }) => { return 

// })



const FolderName = styled.p`
font-size: x-large;
color: white;
position: sticky;
left: 0%;
transform: translateY(30vh);
padding: 10px;
text-align: end;
`
const CollabName = styled.p`
font-family: "HelveticaNeue-light";
font-size: x-large;
color: white;
position: sticky;
left: 0%;
transform: translateY(32vh);
padding-right: 2%;
// padding: 10px;
text-align: end;
`

const Grid = styled.div`
  display: grid;
  // justify-items: center;
  grid-auto-flow: dense;
  grid-template-rows: repeat(988, 1px);
  grid-template-columns: repeat(948, 1px) ;
  grid-gap: 0px;
  // grid-auto-rows: 1px;
  // background: black;
  background: #cccccc;
  position: relative;
  width: fit-content;
  margin-block-start: 30vh;
  margin-block-end: 50vh;
  // padding-inline: 40vw;
  padding-inline: 300px;



  .bumper {
    background: orange;
    width: 100%;
  }
  .picture {
    // background: orange;
    // width: 100%;
  }
  .left {
    grid-column-start: 1;
    grid-column-end: span 119; 
  }
  .right {
    grid-column-end: 948;
    grid-column-start: span 120;
  }


`;

const GridItem = styled.div`
margin: 5px;
position: relative;
display: flex;
flex-wrap: wrap;
justify-content: center;
align-content: center;

background-color: ${({url}) => url ? "blue" : "transparent"};
// background-color: '#00000000';
border-radius: 13px;
overflow: hidden;

// grid-row-end: span 100;
${({row}) => row && `grid-row-start: ${row}` }; 
grid-row-end: ${({orientation}) => orientation ? "span 100" : "span 200"};
grid-column-end: span 118;

// z-index: ${({url}) => url ? "1" : "-5"};
z-index: 1;





${({ openModal, top, left, viewportY, viewportX }) => 
 `
&.double{
  display: -webkit-box;
  transition: 
  height 0.3s ease-in 0s, 
  width 0.3s ease-in 0s, 
  border-radius 0.4s ease-in 0s, 
  background-color 0.3s ease-in 0s, 
  box-shadow 0.3s ease-in 0s, 
  top 0.3s ease-in 0s, 
  left 0.3s ease-in 0s;

  // align-content: center;
  position: fixed; 
  border-radius: ${openModal ? `0px` : '13px' };
  background-color: ${openModal ? `#000000b3` : '#000000'};
  // box-shadow: ${openModal ? `#000000b3 0px 0px 0px 0px` : '#000000 0px 0px 20px 10px'};
  

  width: ${openModal ? `${viewportX}px` : '227px'};
  top: ${openModal ? '-5px' : `${top - 5}px`}; 
  left: ${openModal ? '-5px' : `${left - 5}px`};
  
  &.portrait{
    height: ${openModal ? `${viewportY}px` : '290px'};
  }
  &.landscape{
    height: ${openModal ? `${viewportY}px` : '190px'};  
  }


  
    .picture{
      // height: initial;
      // align-self: center;
  }


  
  // .portrait{height: 295px; width: 227px;}
  // .landscape{height: 190px; width: 227px;}

  .portrait{
    min-width: 227px;

    height: ${openModal ? `${viewportY*.8}px` : '290px'}; 
    border-radius: ${openModal ? `0px` : '13px' };
  }
  .landscape{
    min-height: 190px;
    width: ${openModal ? `${viewportX - 30}px` : '227px' };
    border-radius: ${openModal ? `0px` : '13px' };
  }

  // .portrait{animation: groY .5s both;}
  // .landscape{animation: groX .5s both;}
  

.content-drawer {
    // position: absolute;
    width: inherit;
    // width: -webkit-fill-available;
    // align-self: flex-end;
    display: flex;
    justify-content: center;
    color: white;
    // margin-bottom: 10%;
    // margin-inline: 19%;
    // align-items: flex-end;

  .card-content {
    position: absolute;
    height: ${openModal ? `50px` : '0px'}; 
    overflow: hidden;
    z-index: -4;
    transition: height .2s ease .3s;
    h4 {
      font-size: medium;
      overflow: hidden;
      /* white-space: pre; */
    }
    p {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      /* overflow-wrap: break-word; */
      /* hyphens: manual; */
      text-overflow: ellipsis;
      font-size: medium;
      line-height: 18px;
    }
  }
}   
    ` 
    }

`
//  ${orientation 
//   ? 'height: 190px; width: 227px;' 
//   : 'height: 295px; width: 227px;'}
// .photo{${orientation 
//   ? 'height: 190px; width: 227px;' 
//   : 'height: 295px; width: 227px;'}}
const PictureFrame = styled.img`
    // background-color: ${({url}) => url ? "blue" : "orange"};
    background: orange;
    // width: 100%;
    position: relative;
    border-radius: 13px;
    object-fit: cover;
    // object-position: top;
    transition: 
    height 0.3s ease-in 0s, 
    width 0.3s ease-in 0s, 
    border-radius 0.4s ease-in 0s, 
    top 0.3s ease-in 0s, 
    left 0.3s ease-in 0s;
`

const Square = styled.div`
position: fixed;
z-index: 19;
background-color: red;
opacity:  50%;
&.left{
  left: ${({left}) => left + "px"};
  top: 50px;
  height: 40px;
  width: 3px;
}
}
&.top{
  top: ${({top}) => top + "px"};
  // left: 50px;
  height: 3px;
  width: 40px;
}
}

`
const LoadingModal = styled.div`

    position: fixed;
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    top: 0;
    z-index: ${({imagesLoaded}) => !imagesLoaded ? '7' : '-1'};
    // z-index: 7;
    transition: z-index 0s ease 1s;

.background{
    position: absolute;
    background: gainsboro;
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    opacity: ${({imagesLoaded}) => imagesLoaded ? '0' : '1'};
    // opacity: 1;
    top: 0px;
    color: black;
    font-size: xxx-large;
    padding: 44%;
    z-index: 7;
    transition: opacity .3s ease-out;
}

.foreground{
    position: fixed;
    z-index: 13;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: #dcdcdc8c; 
    backdrop-filter: blur(10px);
    transition: backdrop-filter 4s easy-out;
    animation: blur-in 2s forwards; 
}
@keyframes blur-in {
  from {
    backdrop-filter: blur(10px);
  }
  to {
    backdrop-filter: blur(0px);
  }
}
    
`