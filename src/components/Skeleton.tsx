const Skeleton = ({ height, width }: { height: string; width: string }) => {
    return (
        <div 
            className="bg-white bg-opacity-10 rounded-xl animate-pulse"
            style={{
                height: height,
                width: width
            }}
        />
    )
}

export default Skeleton;