%%%IPark @ Auburn
%%Generate parking lots occupied data
% Output file:observationData.dot

clc, clear all;

%%States of parking lots occupied
%%%
allSTATEs = 4;

stateEMPTY = 0; %EMPTY is < 4 %
stateINCREASE = 1; %This hour's occupation is HIGHER than previous One ||FIRST record is DEFAULT->INCREASE
stateFULL = 2; %FULL is > 96%
stateDECREASE = 3; %This hour's occupation is LOWER THAN orR EQUAL TO previous One
%%
%%Time Setting
numOfTime = 48;%0:00, 0:30,1:00...24:00
for i = 1:numOfTime 
    hourTime(i) = i/2;
end

dayTime = 365; %One year
index = 0;
%vectorTime = [];
for i = 1:dayTime
    for j = 1:numOfTime
        index = index + 1;
        vectorTime(index) = hourTime(j);
        matrixTime(index,1) = i;
        matrixTime(index,2) = vectorTime(index);
    end
end

%%Possibility of Four time periods Parking Lots occupied pesentage 
%%All timePeriod
%time_ZERO_Seven = 0+rand() *0.3; %0 - 0.3
%time_Seven_Nine = 0.4+ rand() *0.5; %0.4 - 0.9
%tiem_Nine_SevenTeen = 0.8+ rand() *0.2; %0.8 - 1.0
%time_SevenTeen_Twenty = 0.1+rand() *0.25; %0.1 - 0.35
%time_Twenty_ZERO =  0+rand() *0.1;%0 - 0.1
%%
for i =1:length(vectorTime)
    hTime = vectorTime(i);
    %Determine Time Period --> Possibility of Occupied
    if hTime <= 7
        time_ZERO_Seven = 0+rand() *0.3; %0 - 0.3
        timePeriod = time_ZERO_Seven;
    elseif hTime >7 & hTime <=9
        time_Seven_Nine = 0.4+ rand() *0.5; %0.4 - 0.9
        timePeriod = time_Seven_Nine;
    elseif hTime >9 & hTime <=17
        tiem_Nine_SevenTeen = 0.8+ rand() *0.2; %0.8 - 1.0
        timePeriod = tiem_Nine_SevenTeen;
    elseif hTime >17 & hTime <=20
        time_SevenTeen_Twenty = 0.1+rand() *0.25; %0.1 - 0.35
        timePeriod = time_SevenTeen_Twenty;
    else
        time_Twenty_ZERO =  0+rand() *0.1;%0 - 0.1
        timePeriod = time_Twenty_ZERO;
    end

    tablePossibilityEachTime(i) = timePeriod;
    
end
matrixTimeAndPossibility = [matrixTime,tablePossibilityEachTime'];  %%DAY | HOUR | POSSIBILITY
%splot tablePossibilityEachTime

%%
%plot(1:length(matrixTime),matrixTimeAndPossibility(:,3))

for i = 1:length(matrixTimeAndPossibility)
    if matrixTimeAndPossibility(i,3)<=0.1
        occupiedState = 0;
    elseif matrixTimeAndPossibility(i,3)>0.1 & matrixTimeAndPossibility(i,3)<=0.2
        occupiedState = 1;
    elseif matrixTimeAndPossibility(i,3)>0.2 & matrixTimeAndPossibility(i,3)<=0.3
        occupiedState = 2;
    elseif matrixTimeAndPossibility(i,3)>0.3 & matrixTimeAndPossibility(i,3)<=0.4
        occupiedState = 3;
    elseif matrixTimeAndPossibility(i,3)>0.4 & matrixTimeAndPossibility(i,3)<=0.5
        occupiedState = 4;
    elseif matrixTimeAndPossibility(i,3)>0.5 & matrixTimeAndPossibility(i,3)<=0.6
        occupiedState = 5;
    elseif matrixTimeAndPossibility(i,3)>0.6 & matrixTimeAndPossibility(i,3)<=0.7
        occupiedState = 6;
    elseif matrixTimeAndPossibility(i,3)>0.7 & matrixTimeAndPossibility(i,3)<=0.8
        occupiedState = 7;
    elseif matrixTimeAndPossibility(i,3)>0.8 & matrixTimeAndPossibility(i,3)<=0.9
        occupiedState = 8;
    else
        occupiedState = 9;
    end 
    vectorOccupied(i) = occupiedState;
end
    matrixOccupiedAdded = [matrixTimeAndPossibility,vectorOccupied']; %%DAY | HOUR | POSSIBILITY | occupiedState
%%%


%save OccupiedAdded.dot matrixOccupiedAdded -ASCII
%%4-States Determin   

state = stateINCREASE;%Default for the first record
vectorState(1)=state;

for i = 2: length(matrixOccupiedAdded)
    if matrixOccupiedAdded(i,3)<0.02
        state = stateEMPTY; %0
    elseif matrixOccupiedAdded(i,3)>0.96
        state = stateFULL; %2
    elseif matrixOccupiedAdded(i,3)>matrixOccupiedAdded(i-1,3)
        state = stateINCREASE; %1
    else 
        state = stateDECREASE; %3 Default if equal
    end
    vectorState(i) =  state;
end

     matrixFinal = [matrixOccupiedAdded,vectorState']; %%DAY | HOUR | POSSIBILITY | occupiedState | state 

     
 %Save data into file observationData.dot   
save observationData.dot matrixFinal -ASCII