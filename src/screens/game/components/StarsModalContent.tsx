import { ModalCard, ModalCloseButton } from '../../../components/modal';
import { leaderboard, userPosition } from '../constants';
import { StarIcon } from '../../../components/icons';

const StarsModalContent = ({ onClose, headingId }: { onClose: () => void; headingId: string }) => (
  <ModalCard className="gap-6">
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-2">
        <h3 id={headingId} className="text-[var(--color-black)]">
          Звёзды (баллы)
        </h3>
        <p className="max-w-[24rem] text-sm leading-relaxed text-[var(--color-muted)]">
          Отвечайте на вопросы, получайте звёзды и поднимайтесь в рейтинге.
        </p>
      </div>

      <ModalCloseButton onClick={onClose} />
    </div>

    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h4 className="text-base font-bold text-[var(--color-black)]">Рейтинг</h4>

        <div className="max-h-[18rem] overflow-y-auto rounded-[1.5rem] border border-[var(--color-border)] bg-white p-3">
          <table className="w-full border-collapse text-left text-sm">
            <tbody className="divide-y divide-[var(--color-border)]">
              {leaderboard.map(({ position, username, score }) => (
                <tr key={username} className="py-2">
                  <td className="py-2 font-semibold text-[var(--color-black)]">{position}</td>
                  <td className="py-2 text-[var(--color-muted)]">{username}</td>
                  <td className="py-2 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-black)]">
                      <StarIcon className="h-4 w-4" />
                      {score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-t border-[var(--color-border)]" />

      <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-black)]">
        <span>{userPosition.position}</span>
        <span>{userPosition.username}</span>
        <span className="inline-flex items-center gap-1">
          <StarIcon className="h-4 w-4" />
          {userPosition.score}
        </span>
      </div>
    </div>
  </ModalCard>
);

export default StarsModalContent;
