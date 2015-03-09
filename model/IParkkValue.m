%IPark
%Generate data for Parking lot occupation
%
clc, clear all;


NotGameDay=0;


Time = [0:24];
MAX_Occupy_Number = 300;
MIN_Occupy_Number = 0;
r_Randon= rand(25,1);
OneDayData = [];

if(NotGameDay)
        time_ZERO_Seven = 0+r_Randon *(0.3-0);
        time_Seven_Nine = 0.4+ r_Randon *0.5;
        tiem_Nine_FiTeen = 0.8+ r_Randon *0.2;
        time_FiTeen_ZERO = 0+r_Randon *(0.2-0);
         label = 'Normal Day Parking';
        %%gameday
else
    
        time_ZERO_Seven = 0+r_Randon *(0.7-0);
        time_Seven_Nine = 0.6+ r_Randon *0.4;
        tiem_Nine_FiTeen = 0.8+ r_Randon *0.2;
        time_FiTeen_ZERO = 0+r_Randon *(1-0);
          label = 'Game Day Parking';
end

for i = 1:25
   if i <= 7
       OneDayData(i) = time_ZERO_Seven(i);
   elseif i>7 && i <= 9
       OneDayData(i) = time_Seven_Nine(i);
   elseif i>9 && i <= 17
        OneDayData(i) = tiem_Nine_FiTeen(i);
   else  
        OneDayData(i) = time_FiTeen_ZERO(i);
   end
   OneDayData(i) = OneDayData(i)*MAX_Occupy_Number;

end

K=[];
for i=1:25
    K=[K,0.25+rand()*0.1];
end
ReserveData = round(OneDayData.*K);

%plot(Time, OneDayData,'g')
%%find matrix k
for j=1:25
    PredictK(j) = OneDayData(j)/ReserveData(j);

end
%disturb = rand()-rand();
k = (max(PredictK)-min(PredictK))*rand(1)+min(PredictK);

for m = 1:25
    prdictData(m) = ReserveData(m).*k;    
    prdictData(m) = prdictData(m) + 80* (0.5-rand(1));
    if(prdictData(m))>300
        prdictData(m)=300;
    end

end

figure
realOccupy = plot(Time,OneDayData,'b','LineWidth',1);
hold on
SysOccupy = plot(Time,ReserveData,'r','LineWidth',1);
hold on
prdictData = plot(Time,prdictData,'g','LineWidth',1.5);


legend([realOccupy,SysOccupy,prdictData],'Real Occupied','Reserved in System','Predicted Data')
title(label)
xlim([0 24])
xlabel('Time')
ylabel('Parking Lots Occupied Number')

%%Generate data to file 
time = 0:24;
len = length(OneDayData);
data = [];
%%
% for i=1:len
%     if (time <= 24)
%         data(i,) = [OneDayData(i),time];
%         time = 1+time;
%     else
%         time = 1;
%         data(i) = [OneDayData(i),time];
%     end
% end
%%%



data = [OneDayData',time']
save observation.dot data -ASCII
