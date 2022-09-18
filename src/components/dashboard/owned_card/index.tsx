import './index.scss'

const OwnedCard = (props: any) => {
  const { img, name } = props
  return (
    <div className='owned-card-body'>
      <div className='nft-img'>
        <img src={img} alt={name} />
      </div>
      <div className='nft-name'>
        {name}
      </div>
    </div>
  )
}

export default OwnedCard