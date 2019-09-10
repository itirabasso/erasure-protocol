pragma solidity ^0.5.0;

import "../modules/Countdown.sol";

contract TestCountdown is Countdown {

    function setDeadline(uint256 deadline) public {
        Deadline._setDeadline(deadline);
    }

    function setLength(uint256 length) public {
        Countdown._setLength(length);
    }

    function start() public {
        Countdown._start();
    }

    function echidna_not_over() public view returns(bool) {
        // Countdown is started and the Deadline is not past
        // should not return isOver
        if (Countdown.getLength() > 0 &&
            Deadline.getDeadline() > 0 &&
            now < Deadline.getDeadline()) {
            return !Countdown.isOver();
        }
        return true;
    }

    function echidna_is_over() public view returns(bool) {
        // Countdown is started and the Deadline is not past
        // should not return isOver
        if (Countdown.getLength() > 0 &&
            Deadline.getDeadline() > 0 &&
            now >= Deadline.getDeadline()) {
            return Countdown.isOver();
        }
        return true;
    }

    function echidna_before_deadline() public view returns(bool) {
        if (Countdown.getLength() > 0 && Deadline.getDeadline() < now) {
            return !Deadline.isAfterDeadline();
        }
        return true;
    }

    function echidna_after_deadline() public view returns(bool) {
        if (Deadline.getDeadline() > 0 && now >= Deadline.getDeadline()) {
            return Deadline.isAfterDeadline();
        }
        return true;
    }

    function echidna_no_time_remaining() public view returns(bool) {
        if (Countdown.getLength() > 0 && Deadline.getDeadline() >= now) {
            return Countdown.timeRemaining() == 0;
        }
        return true;
    }

    function echidna_time_remaining() public view returns(bool) {
        if (Countdown.getLength() > 0 && Deadline.getDeadline() < now) {
            return Countdown.timeRemaining() > 0;
        }
        return true;
    }
}
