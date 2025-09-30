import { StarIcon } from '../../../components/icons';
import achivGazik from '../../../assets/achivGazik.png';

export type RewardCardProps = {
  title: string;
  reward: number;
  unlocked?: boolean;
};

const RewardCard = ({ title, reward, unlocked = false }: RewardCardProps) => (
  <div
    style={{
      filter: unlocked ? 'none' : 'grayscale(0.6) brightness(0.8)',
    }}
    className={`relative flex flex-col justify-between items-center rounded-[20px] h-[140px] bg-gradient-to-tr from-[#58FFFF] to-[#1919EF] text-white`}
  >
    <img src={achivGazik} alt={title} className={'w-[62px] mt-[-10px]'} />
    <p className="px-4 font-semibold text-[10px] text-center leading-tight">{title}</p>

    <div className={`pb-[5px]`}>
      <div className="w-full inline-flex items-center justify-center gap-1 text-white">
        <StarIcon className="h-[12px] w-[12px] text-[var(--color-violet)]" />
        <span className="font-semibold leading-tight text-[10px] text-[var(--color-violet)]">
          {reward}
        </span>
      </div>
    </div>
  </div>
);

export default RewardCard;
