import CoppyIcon from 'assets/svg/copy.svg'
import TrashIcon from 'assets/svg/trash-2.svg'
import EditIcon from 'assets/svg/edit-2.svg'
const ActionGroupIcon=()=>{
    return (
        <div className="flex gap-x-4">
            <CoppyIcon/>
            <TrashIcon/>
            <EditIcon/>
        </div>
    )
}
export default ActionGroupIcon