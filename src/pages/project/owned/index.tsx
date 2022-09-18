// custom components
import OwnedCard from '../../../components/dashboard/owned_card';
import './index.scss'
// redux
import { useAppSelector } from '../../../app/hooks';
import { selectOwnedNfts, selectOneProject } from '../../../app/slice/projectSlice';
import { selectLoadingFlag } from '../../../app/slice/wallletSlice';

const Owned = () => {
  const data = useAppSelector(selectOwnedNfts)
  const selectedProject = useAppSelector(selectOneProject)
  const loadingFlag = useAppSelector(selectLoadingFlag)

  return (
    <div className='owned-body'>
      <div className='title'>
        Owned {selectedProject.name} NFTs: {data.length}
      </div>
      <div className='nft-section'>
        {
          data.length > 0 ? data.map((item: any, index: number) => {
            return <OwnedCard key={index} img={item.image} name={item.name} />
          }) : loadingFlag ? (
            <div className='no-nft'>Loading your NFTs...</div>
          ) : (
            <div className='no-nft'>You have no NFTs</div>
          )
        }
      </div>
    </div>
  )
}

export default Owned